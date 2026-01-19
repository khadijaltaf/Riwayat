
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Image, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function MediaDetailScreen() {
    const router = useRouter();
    const { type, id } = useLocalSearchParams();

    // Mock data based on type
    const isLogo = type === 'logo';
    const isVideo = type === 'video';
    const title = isLogo ? 'logo' : isVideo ? 'Video' : 'Media Detail';

    // State for inputs
    const [mediaName, setMediaName] = useState('Type Here');
    const [caption, setCaption] = useState('');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#600E10" />
                </Pressable>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* Media Preview Area */}
                <View style={styles.previewContainer}>
                    {isLogo ? (
                        <Image
                            source={{ uri: 'https://via.placeholder.com/300/FFF0E0/FF5722?text=Logo' }}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    ) : isVideo ? (
                        <View style={styles.videoPlaceholder}>
                            <Ionicons name="play" size={48} color="#FFF" />
                        </View>
                    ) : (
                        <Image
                            source={{ uri: 'https://via.placeholder.com/300' }}
                            style={styles.logoImage}
                            resizeMode="cover"
                        />
                    )}
                </View>

                {/* Fields - Only shown for Logo/Image? Screenshot for Video doesn't show fields, only actions. 
                   Wait, screenshot 1 (Video) has NO fields. Screenshot 5 (Logo) HAS fields.
                   So conditionally render fields based on type. 
                */}

                {isLogo && (
                    <>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Media Name</Text>
                            <TextInput
                                style={styles.input}
                                value={mediaName}
                                onChangeText={setMediaName}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Caption</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={caption}
                                onChangeText={setCaption}
                                placeholder="Type Here..."
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Bottom Actions - Shown in BOTH Video and Logo screenshots */}
            <View style={styles.bottomActions}>
                <Pressable style={styles.actionBtn}>
                    <Ionicons name="trash-outline" size={24} color="#000" />
                    <Text style={styles.actionText}>Delete</Text>
                </Pressable>

                <Pressable style={styles.actionBtn}>
                    <Ionicons name="close-circle-outline" size={24} color="#000" />
                    <Text style={styles.actionText}>Inactive</Text>
                </Pressable>

                <Pressable style={styles.actionBtn} onPress={() => router.back()}>
                    <Ionicons name="ban-outline" size={24} color="#000" />
                    <Text style={styles.actionText}>Cancel</Text>
                </Pressable>

                {/* Video screen has a 'Pin' action, Logo doesn't. */}
                {isVideo && (
                    <Pressable style={styles.actionBtn}>
                        <Ionicons name="push-outline" size={24} color="#000" />
                        <Text style={styles.actionText}>Pin</Text>
                    </Pressable>
                )}
            </View>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
        textTransform: 'capitalize',
    },
    content: {
        padding: 24,
    },
    previewContainer: {
        width: '100%',
        aspectRatio: 1.2, // Rectangular
        backgroundColor: '#F0E6FF', // Light purple tint from "Logo" screenshot
        borderRadius: 0, // Seems square in screenshot or slight border?
        // Actually the Logo screenshot has a purple container background.
        // Video screenshot has orange full width container.
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        overflow: 'hidden',
    },
    logoImage: {
        width: '60%',
        height: '60%',
    },
    videoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F26925', // Orange
        justifyContent: 'center',
        alignItems: 'center',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
        elevation: 1,
    },
    textArea: {
        minHeight: 100,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: '#F4F7FC',
        paddingBottom: 40,
    },
    actionBtn: {
        alignItems: 'center',
        gap: 5,
    },
    actionText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
    },
});
