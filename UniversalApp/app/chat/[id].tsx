
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { ActionSheetIOS, ActivityIndicator, Alert, FlatList, Image, Keyboard, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '@/lib/api-client';
import { ChatMessage, chatService } from '@/lib/chat-service';
import { storageService } from '@/services/storage-service';

// UI Theme Colors
const THEME = {
    primary: '#600E10', // Dark Red for Riwayat
    secondary: '#FFFFFF',
    bg: '#F4F7FC',
    inputBg: '#E8F0FE',
    sendBtn: '#4CAF50',
};

type Message = {
    id: string;
    text?: string;
    image?: string;
    video?: string;
    audio?: string;
    sender: 'user' | 'other';
    time: string;
    duration?: number; // Duration for audio
};

export default function ChatDetailScreen() {
    const { id, name, userPhone } = useLocalSearchParams<{ id: string; name: string; userPhone: string }>();
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
    const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
    const [isRecording, setIsRecording] = useState(false);
    const [attachmentModalVisible, setAttachmentModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();

    // Permissions
    const [audioPermission, requestAudioPermission] = Audio.usePermissions();

    const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(null);

    useEffect(() => {
        fetchCurrentUser();
        if (id) {
            loadMessages();
            const channel = chatService.subscribeToMessages(id, (newMsg) => {
                setMessages(prev => {
                    const exists = prev.find(m => m.id === newMsg.id);
                    if (exists) return prev;
                    return [...prev, newMsg];
                });
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            });
            return () => {
                channel.unsubscribe();
            };
        }
    }, [id]);

    const fetchCurrentUser = async () => {
        const { data: { user } } = await api.auth.getUser();
        if (user) {
            const { data: profile } = await api.profile.get(user.id);
            if (profile) setCurrentUserPhone(profile.phone);
        }
    };

    const loadMessages = async () => {
        try {
            const history = await chatService.getMessages(id!);
            setMessages(history);
            setLoading(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
        } catch (e) {
            console.error('Error loading history:', e);
            setLoading(false);
        }
    };

    const handleSend = async () => {
        Keyboard.dismiss();
        if (!inputText.trim()) return;
        const text = inputText;
        setInputText('');

        // Optimistic UI update - add message immediately
        const tempMessage: ChatMessage = {
            id: `temp_${Date.now()}`,
            conversation_id: id!,
            sender_phone: currentUserPhone || 'Unknown',
            content: text,
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMessage]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const sentMessage = await chatService.sendMessage({
                conversation_id: id!,
                sender_phone: currentUserPhone || 'Unknown',
                content: text
            });

            // Replace temp message with real one
            setMessages(prev => prev.map(m =>
                m.id === tempMessage.id ? sentMessage : m
            ));
        } catch (e) {
            console.warn('Failed to send message, keeping local copy:', e);
            // Message stays in UI even if send fails
        }
    };

    const handleLocationShare = async () => {
        setAttachmentModalVisible(false);
        try {
            await chatService.sendMessage({
                conversation_id: id!,
                sender_phone: currentUserPhone || 'Unknown',
                location_data: {
                    latitude: 31.5204,
                    longitude: 74.3587,
                    address: 'Lahore, Pakistan'
                }
            });
        } catch (e) {
            Alert.alert('Error', 'Failed to share location');
        }
    };

    const handleAttachmentAction = (type: 'camera' | 'image' | 'video' | 'audio' | 'location') => {
        setAttachmentModalVisible(false);
        if (type === 'location') {
            handleLocationShare();
        } else if (type === 'camera' || type === 'image' || type === 'video') {
            handleMediaPick(type);
        } else if (type === 'audio') {
            Alert.alert('Notice', 'Voice recording is available via the mic icon.');
        }
    };

    const handleMediaPick = async (type: 'camera' | 'image' | 'video') => {
        let result: ImagePicker.ImagePickerResult;
        if (type === 'camera') {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) return Alert.alert('Permission Denied', 'Camera permission is required.');
            result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: type === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });
        }

        if (!result.canceled) {
            const asset = result.assets[0];
            try {
                const { publicUrl, error } = await storageService.uploadFile(asset.uri, 'chat-media');
                if (error) throw new Error(error);

                await chatService.sendMessage({
                    conversation_id: id!,
                    sender_phone: currentUserPhone || 'Unknown',
                    image_url: type !== 'video' ? (publicUrl || undefined) : undefined,
                    metadata: type === 'video' ? { video_url: publicUrl } : undefined
                });
            } catch (e) {
                Alert.alert('Upload Failed', 'Could not send media.');
            }
        }
    };

    async function startRecording() {
        try {
            if (!audioPermission?.granted) {
                const permission = await requestAudioPermission();
                if (!permission.granted) return;
            }
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        if (!recording) return;
        setIsRecording(false);
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        if (uri) {
            try {
                const { publicUrl, error } = await storageService.uploadFile(uri, 'chat-media');
                if (error) throw new Error(error);

                await chatService.sendMessage({
                    conversation_id: id!,
                    sender_phone: currentUserPhone || 'Unknown',
                    audio_url: publicUrl || undefined,
                    metadata: { type: 'voice_note' }
                });
            } catch (e) {
                Alert.alert('Error', 'Failed to send voice note');
            }
        }
    }

    const playSound = async (uri: string) => {
        try {
            if (sound) await sound.unloadAsync();
            const { sound: newSound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
            setSound(newSound);
        } catch (e) {
            Alert.alert("Playback Error", "Could not play audio.");
        }
    };

    const handleCallAction = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancel', 'Call from App', 'Call from Phone'],
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) router.push({ pathname: '/chat/call-screen', params: { name } });
                    if (buttonIndex === 2) Linking.openURL('tel:1234567890');
                }
            );
        } else {
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
        }
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isUser = item.sender_phone === currentUserPhone;
        const time = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <View style={[styles.msgContainer, isUser ? styles.msgRight : styles.msgLeft]}>
                <View style={[styles.bubble, isUser ? styles.bubbleRight : styles.bubbleLeft]}>
                    {item.content && <Text style={[styles.msgText, isUser ? styles.textRight : styles.textLeft]}>{item.content}</Text>}

                    {item.image_url && (
                        <TouchableOpacity activeOpacity={0.9} onPress={() => {/* View Image Logic */ }}>
                            <Image source={{ uri: item.image_url }} style={styles.msgImage} />
                        </TouchableOpacity>
                    )}

                    {item.location_data && (
                        <TouchableOpacity
                            style={styles.locationContainer}
                            onPress={() => item.location_data && Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${item.location_data.latitude},${item.location_data.longitude}`)}
                        >
                            <View style={styles.locationHeader}>
                                <Ionicons name="location" size={20} color={isUser ? '#FFF' : '#600E10'} />
                                <Text style={[styles.locationTitle, isUser && { color: '#FFF' }]}>Shared Location</Text>
                            </View>
                            <Text style={[styles.locationAddress, isUser && { color: '#EEE' }]}>{item.location_data?.address}</Text>
                        </TouchableOpacity>
                    )}

                    {item.audio_url && (
                        <View style={styles.audioRow}>
                            <Pressable onPress={() => playSound(item.audio_url!)}>
                                <Ionicons name="play-circle" size={32} color={isUser ? '#FFF' : '#333'} />
                            </Pressable>
                            <View style={styles.audioWaveStub}>
                                <View style={[styles.bar, { height: 10, backgroundColor: isUser ? 'rgba(255,255,255,0.7)' : '#999' }]} />
                                <View style={[styles.bar, { height: 16, backgroundColor: isUser ? 'rgba(255,255,255,0.7)' : '#999' }]} />
                                <View style={[styles.bar, { height: 8, backgroundColor: isUser ? 'rgba(255,255,255,0.7)' : '#999' }]} />
                                <View style={[styles.bar, { height: 20, backgroundColor: isUser ? 'rgba(255,255,255,0.7)' : '#999' }]} />
                                <View style={[styles.bar, { height: 12, backgroundColor: isUser ? 'rgba(255,255,255,0.7)' : '#999' }]} />
                            </View>
                        </View>
                    )}
                </View>
                <Text style={styles.msgTime}>{time}</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#600E10" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
        >
            <StatusBar style="dark" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#600E10" />
                </Pressable>

                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{name || 'Chat'}</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Online</Text>
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
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
            />

            {/* Recording Indicator Overlay */}
            {isRecording && (
                <View style={styles.recordingOverlay}>
                    <View style={styles.recordingIndicator}>
                        <Ionicons name="mic" size={24} color="#FFF" style={styles.recordingIconBlink} />
                        <Text style={styles.recordingText}>Recording...</Text>
                    </View>
                </View>
            )}

            {/* Quick Replies */}
            {!isRecording && (
                <View style={styles.quickReplies}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingRight: 20 }}>
                        <Pressable style={styles.chip}><Text style={styles.chipText}>Help with order</Text></Pressable>
                        <Pressable style={styles.chip}><Text style={styles.chipText}>Payment issue</Text></Pressable>
                        <Pressable style={styles.chip}><Text style={styles.chipText}>Technical problem</Text></Pressable>
                    </ScrollView>
                </View>
            )}

            {/* Input */}
            <View style={[styles.inputArea, { paddingBottom: Math.max(insets.bottom, 10) }]}>
                {/* Attachment Button */}
                <Pressable
                    onPress={() => setAttachmentModalVisible(true)}
                    style={styles.attachBtn}
                    disabled={isRecording}
                >
                    <Ionicons name="add-circle-outline" size={28} color="#600E10" />
                </Pressable>

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                        editable={!isRecording}
                    />
                </View>

                {inputText ? (
                    <Pressable onPress={handleSend} style={styles.sendBtn}>
                        <Ionicons name="send" size={20} color="#FFF" />
                    </Pressable>
                ) : (
                    <Pressable
                        onLongPress={startRecording}
                        onPressOut={stopRecording}
                        delayLongPress={200}
                        style={[styles.micBtn, isRecording && styles.micActive]}
                    >
                        <Ionicons name={isRecording ? "mic" : "mic-outline"} size={22} color="#FFF" />
                    </Pressable>
                )}
            </View>

            {/* Attachments Modal */}
            <Modal
                transparent={true}
                visible={attachmentModalVisible}
                animationType="fade"
                onRequestClose={() => setAttachmentModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setAttachmentModalVisible(false)}>
                    <View style={styles.attachmentSheet}>
                        <View style={styles.sheetHandle} />
                        <Text style={styles.sheetTitle}>Share Content</Text>

                        <View style={styles.attachmentGrid}>
                            <AttachmentOption
                                icon="camera"
                                label="Camera"
                                color="#E91E63"
                                onPress={() => handleAttachmentAction('camera')}
                            />
                            <AttachmentOption
                                icon="image"
                                label="Gallery"
                                color="#9C27B0"
                                onPress={() => handleAttachmentAction('image')}
                            />
                            <AttachmentOption
                                icon="videocam"
                                label="Video"
                                color="#2196F3"
                                onPress={() => handleAttachmentAction('video')}
                            />
                            <AttachmentOption
                                icon="musical-notes"
                                label="Audio"
                                color="#FF9800"
                                onPress={() => handleAttachmentAction('audio')}
                            />
                            <AttachmentOption
                                icon="location"
                                label="Location"
                                color="#4CAF50"
                                onPress={() => handleAttachmentAction('location')}
                            />
                        </View>

                        <Pressable style={styles.cancelBtn} onPress={() => setAttachmentModalVisible(false)}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>

        </KeyboardAvoidingView>
    );
}

const AttachmentOption = ({ icon, label, color, onPress }: { icon: any, label: string, color: string, onPress: () => void }) => (
    <Pressable style={styles.attachmentItem} onPress={onPress}>
        <View style={[styles.attachmentIcon, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={28} color={color} />
        </View>
        <Text style={styles.attachmentLabel}>{label}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#F4F7FC',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backBtn: {
        marginRight: 10,
        padding: 5,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
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
        fontFamily: 'Poppins_400Regular',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    listContent: {
        padding: 15,
        paddingBottom: 20,
    },
    msgContainer: {
        marginBottom: 15,
        width: '100%',
    },
    msgLeft: {
        alignItems: 'flex-start',
    },
    msgRight: {
        alignItems: 'flex-end',
    },
    bubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
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
        backgroundColor: '#600E10', // Updated to Dark Red
        borderTopRightRadius: 4,
    },
    msgText: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        lineHeight: 22,
    },
    textLeft: {
        color: '#1A1A1A',
    },
    textRight: {
        color: '#FFFFFF',
    },
    msgImage: {
        width: 220,
        height: 160,
        borderRadius: 12,
        backgroundColor: '#EEE'
    },
    videoStub: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 5
    },
    videoText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
    },
    msgTime: {
        fontSize: 10,
        color: '#999',
        marginTop: 4,
        marginHorizontal: 5,
        fontFamily: 'Poppins_400Regular',
    },
    // Location
    locationContainer: {
        width: 200,
        padding: 5,
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 5,
    },
    locationTitle: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#600E10',
    },
    locationAddress: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
    },
    // Audio
    audioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 4,
        minWidth: 150
    },
    audioWaveStub: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        flex: 1,
        justifyContent: 'center'
    },
    bar: {
        width: 3,
        borderRadius: 2,
    },
    audioDuration: {
        fontSize: 11,
        marginLeft: 5,
        fontFamily: 'Poppins_400Regular',
    },
    // Recording UI
    recordingOverlay: {
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 15,
        borderRadius: 30,
    },
    recordingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    recordingIconBlink: {
        opacity: 0.9,
    },
    recordingText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
    },
    // Quick Replies
    quickReplies: {
        height: 44,
        paddingHorizontal: 15,
        marginBottom: 8,
    },
    chip: {
        backgroundColor: '#E3F2FD',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    chipText: {
        fontSize: 12,
        color: '#1565C0',
        fontFamily: 'Poppins_500Medium',
    },
    // Input
    inputArea: {
        flexDirection: 'row',
        alignItems: 'flex-end', // Align bottom for multiline growth
        paddingTop: 10,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    attachBtn: {
        padding: 10,
        marginBottom: 2,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 24,
        marginHorizontal: 5,
        paddingHorizontal: 15,
        paddingVertical: 8, // Fixed padding
        marginBottom: 6, // Align with buttons
        minHeight: 40,
        maxHeight: 120,
    },
    input: {
        fontSize: 15,
        color: '#1A1A1A',
        fontFamily: 'Poppins_400Regular',
        padding: 0, // Remove default Android padding
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#600E10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        marginLeft: 4,
    },
    micBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#600E10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        marginLeft: 4,
    },
    micActive: {
        backgroundColor: '#D32F2F',
        transform: [{ scale: 1.1 }],
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    attachmentSheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
    },
    sheetHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 15,
    },
    sheetTitle: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginBottom: 20,
        textAlign: 'center',
    },
    attachmentGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    attachmentItem: {
        alignItems: 'center',
        gap: 8,
        width: '22%',
    },
    attachmentIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    attachmentLabel: {
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
        color: '#333',
    },
    cancelBtn: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#600E10',
    }
});
