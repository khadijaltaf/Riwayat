
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Image, KeyboardAvoidingView, Platform, Keyboard, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function ChefStoryScreen() {
    const router = useRouter();
    const [chefName, setChefName] = useState("Hassan");
    const [chefBio, setChefBio] = useState("Authentic Arabic cuisine prepared with love and traditional recipes passed down through generations. We specialize in North Indian dishes with a modern twist.");
    const [chefJourney, setChefJourney] = useState("Authentic Arabic cuisine prepared with love and traditional recipes passed down through generations. We specialize in North Indian dishes with a modern twist.");
    const [submitModalVisible, setSubmitModalVisible] = useState(false);

    const renderMediaSection = (title: string, type: 'audio' | 'video' | 'picture', note: string) => (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Pressable style={styles.uploadBtn}>
                    <Text style={styles.uploadBtnText}>Upload</Text>
                </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaRow}>
                {[1, 2, 3, 4].map((item, index) => (
                    <View key={index} style={styles.mediaItem}>
                        {type === 'audio' && (
                            <View style={[styles.mediaPlaceholder, { backgroundColor: '#F26925' }]}>
                                <Ionicons name="musical-note" size={24} color="#FFF" />
                            </View>
                        )}
                        {type === 'video' && (
                            <View style={[styles.mediaPlaceholder, { backgroundColor: '#F26925' }]}>
                                <Ionicons name="videocam" size={24} color="#FFF" />
                            </View>
                        )}
                        {type === 'picture' && (
                            <Image
                                source={{ uri: `https://via.placeholder.com/150?text=Img${item}` }}
                                style={styles.imagePlaceholder}
                            />
                        )}
                    </View>
                ))}
            </ScrollView>
            <Text style={styles.noteText}>
                <Text style={styles.noteLabel}>Note: </Text>
                {note}
            </Text>
        </View>
    );

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
                <Text style={styles.headerTitle}>Chef Story</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Chef Name</Text>
                    <TextInput
                        style={styles.input}
                        value={chefName}
                        onChangeText={setChefName}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Chef Bio</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={chefBio}
                        onChangeText={setChefBio}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Chef Journey</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={chefJourney}
                        onChangeText={setChefJourney}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {renderMediaSection("Audio", "audio", "You can add many Audio, but only one can be active.")}
                {renderMediaSection("Video", "video", "You can add many Videos, but only one can be active.")}
                {renderMediaSection("Pictures", "picture", "You can add many Images.")}

                <View style={{ height: 20 }} />

                <Pressable style={styles.saveBtn} onPress={() => {
                    Keyboard.dismiss();
                    setSubmitModalVisible(true);
                }}>
                    <Text style={styles.saveText}>Save Story</Text>
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Submit Request Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={submitModalVisible}
                onRequestClose={() => setSubmitModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModalContent}>
                        <Pressable onPress={() => setSubmitModalVisible(false)} style={styles.closeIcon}>
                            <Ionicons name="close" size={24} color="#333" />
                        </Pressable>

                        <View style={styles.hourglassIcon}>
                            <Ionicons name="hourglass-outline" size={30} color="#F28B50" />
                        </View>

                        <Text style={styles.modalTitle}>Submit Request</Text>
                        <Text style={styles.modalDesc}>
                            Your request has been submitted to Riwayat Team
                        </Text>

                        <View style={styles.modalActions}>
                            <Pressable style={styles.modalCancelBtn} onPress={() => setSubmitModalVisible(false)}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.modalConfirmBtn} onPress={() => {
                                setSubmitModalVisible(false);
                                router.back();
                            }}>
                                <Text style={styles.modalConfirmText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
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
    },
    content: {
        padding: 24,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
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
        minHeight: 120,
    },
    sectionContainer: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
    },
    uploadBtn: {
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#600E10',
        backgroundColor: '#F4F7FC',
    },
    uploadBtnText: {
        color: '#600E10',
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
    },
    mediaRow: {
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 2,
    },
    mediaItem: {
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
    },
    mediaPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        backgroundColor: '#DDD',
    },
    noteText: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
        marginTop: 5,
    },
    noteLabel: {
        color: '#FF5722',
        fontFamily: 'Poppins_600SemiBold',
    },
    saveBtn: {
        backgroundColor: '#4E0D0F',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    saveText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmModalContent: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
    },
    closeIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    hourglassIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#000',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalDesc: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
        justifyContent: 'center',
    },
    modalCancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E8906C',
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#000',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
    },
    modalConfirmBtn: {
        flex: 1,
        backgroundColor: '#4E0D0F',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
    },
    modalConfirmText: {
        color: '#FFF',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
    },
});
