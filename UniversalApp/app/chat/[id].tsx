
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, TextInput, Image, KeyboardAvoidingView, Platform, Alert, Linking, ActionSheetIOS, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

// UI Theme Colors
const THEME = {
    primary: '#FF5722', // Orange for user bubbles
    secondary: '#FFFFFF', // White for other bubbles
    bg: '#F4F7FC',
    inputBg: '#E8F0FE', // Light blue input area
    sendBtn: '#4CAF50', // Green send button
};

type Message = {
    id: string;
    text?: string;
    image?: string;
    audio?: string;
    sender: 'user' | 'other';
    time: string;
};

export default function ChatDetailScreen() {
    const { id, name } = useLocalSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello! Welcome to Riwayat Support.\nHow can I help you today?', sender: 'other', time: '10:30 AM' },
        { id: '2', text: 'Hi, I have a question about my recent payout.', sender: 'user', time: '10:31 AM' },
        { id: '3', text: 'I’d be happy to help you with that!\nCould you please provide your payout transaction ID?', sender: 'other', time: '10:32 AM' },
    ]);
    const [inputText, setInputText] = useState('');
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
    const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
    const flatListRef = useRef<FlatList>(null);

    // Permissions
    const [audioPermission, requestAudioPermission] = Audio.usePermissions();

    useEffect(() => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        const newMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, newMsg]);
        setInputText('');
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newMsg: Message = {
                id: Date.now().toString(),
                image: result.assets[0].uri,
                sender: 'user',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, newMsg]);
        }
    };

    async function startRecording() {
        try {
            if (!audioPermission?.granted) {
                const permission = await requestAudioPermission();
                if (!permission.granted) return;
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        if (!recording) return;
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (uri) {
            const newMsg: Message = {
                id: Date.now().toString(),
                audio: uri,
                sender: 'user',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, newMsg]);
        }
    }

    const playSound = async (uri: string) => {
        try {
            // Stop previous sound if any
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync({ uri });
            setSound(newSound);
            await newSound.playAsync();
        } catch (e) {
            console.log("Error playing sound", e);
        }
    };

    const handleCallAction = () => {
        Alert.alert(
            "Call Options",
            "Choose a method to call",
            [
                {
                    text: "Call from App",
                    onPress: () => router.push({ pathname: '/chat/call-screen', params: { name } })
                },
                {
                    text: "Call from Phone",
                    onPress: () => Linking.openURL('tel:1234567890')
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.msgContainer, isUser ? styles.msgRight : styles.msgLeft]}>
                {/* Sender Name if needed, skipping for cleaner look */}

                <View style={[styles.bubble, isUser ? styles.bubbleRight : styles.bubbleLeft]}>
                    {item.text && <Text style={[styles.msgText, isUser ? styles.textRight : styles.textLeft]}>{item.text}</Text>}
                    {item.image && (
                        <Image source={{ uri: item.image }} style={styles.msgImage} />
                    )}
                    {item.audio && (
                        <View style={styles.audioRow}>
                            <Pressable onPress={() => playSound(item.audio!)}>
                                <Ionicons name="play-circle" size={32} color={isUser ? '#FFF' : '#333'} />
                            </Pressable>
                            <View style={styles.audioWaveStub}>
                                <View style={[styles.bar, { height: 10 }]} />
                                <View style={[styles.bar, { height: 16 }]} />
                                <View style={[styles.bar, { height: 8 }]} />
                                <View style={[styles.bar, { height: 20 }]} />
                                <View style={[styles.bar, { height: 12 }]} />
                            </View>
                            <Text style={[styles.audioDuration, isUser ? { color: '#EEE' } : { color: '#666' }]}>0:05</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.msgTime}>{item.time}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#600E10" />
                </Pressable>

                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Chats</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Agent online</Text>
                    </View>
                </View>

                <View style={styles.headerActions}>
                    <Pressable onPress={handleCallAction} style={styles.iconCircle}>
                        <Ionicons name="call-outline" size={20} color="#600E10" />
                    </Pressable>
                    <Pressable onPress={() => Alert.alert('Coming Soon', 'Video call is under development')} style={styles.iconCircle}>
                        <Ionicons name="videocam-outline" size={20} color="#600E10" />
                    </Pressable>
                </View>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Quick Replies (Static for now) */}
            <View style={styles.quickReplies}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingRight: 20 }}>
                    <Pressable style={styles.chip}><Text style={styles.chipText}>Help with order</Text></Pressable>
                    <Pressable style={styles.chip}><Text style={styles.chipText}>Payment issue</Text></Pressable>
                    <Pressable style={styles.chip}><Text style={styles.chipText}>Technical problem</Text></Pressable>
                </ScrollView>
            </View>

            {/* Input */}
            <View style={styles.inputArea}>
                <Pressable style={styles.attachBtn}>
                    <Ionicons name="attach" size={24} color="#666" />
                </Pressable>
                <Pressable onPress={handleImagePick} style={styles.attachBtn}>
                    <Ionicons name="image-outline" size={24} color="#666" />
                </Pressable>

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                </View>

                {inputText ? (
                    <Pressable onPress={handleSend} style={styles.sendBtn}>
                        <Ionicons name="send" size={20} color="#FFF" />
                    </Pressable>
                ) : (
                    <Pressable
                        onPressIn={startRecording}
                        onPressOut={stopRecording}
                        style={[styles.micBtn, recording && styles.micActive]}
                    >
                        <Ionicons name={recording ? "mic" : "mic-outline"} size={22} color="#FFF" />
                    </Pressable>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#F4F7FC',
    },
    backBtn: {
        marginRight: 10,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
    },
    statusText: {
        fontSize: 12,
        color: '#4CAF50',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 15,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    listContent: {
        padding: 20,
        paddingBottom: 10,
    },
    msgContainer: {
        marginBottom: 20,
        width: '100%',
    },
    msgLeft: {
        alignItems: 'flex-start',
    },
    msgRight: {
        alignItems: 'flex-end',
    },
    bubble: {
        maxWidth: '80%',
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    bubbleLeft: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 4,
    },
    bubbleRight: {
        backgroundColor: '#FF5722', // Orange
        borderTopRightRadius: 4,
    },
    msgText: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
    },
    textLeft: {
        color: '#1A1A1A',
    },
    textRight: {
        color: '#FFFFFF',
    },
    msgImage: {
        width: 200,
        height: 150,
        borderRadius: 12,
    },
    msgTime: {
        fontSize: 11,
        color: '#999',
        marginTop: 5,
        marginHorizontal: 5,
    },
    // Audio
    audioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    audioWaveStub: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    bar: {
        width: 3,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 2,
    },
    audioDuration: {
        fontSize: 12,
        marginLeft: 5,
    },
    // Quick Replies
    quickReplies: {
        height: 50,
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    chip: {
        backgroundColor: '#D1E4FF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
    },
    chipText: {
        fontSize: 13,
        color: '#1A1A1A',
        fontFamily: 'Poppins_500Medium',
    },
    // Input
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#F4F7FC',
    },
    attachBtn: {
        padding: 8,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#E8F0FE', // Light blue
        borderRadius: 25,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#D0D0D0',
    },
    input: {
        fontSize: 16,
        maxHeight: 100,
        color: '#1A1A1A',
        fontFamily: 'Poppins_400Regular',
    },
    sendBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2E7D32', // Green
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    micBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2E7D32', // Green
        justifyContent: 'center',
        alignItems: 'center',
    },
    micActive: {
        backgroundColor: '#D32F2F',
        transform: [{ scale: 1.1 }],
    },
});
