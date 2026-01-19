
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Modal, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function KitchenInfoScreen() {
    const router = useRouter();

    // State matching the screenshot ("Best Kitchen", etc.)
    const [kitchenName, setKitchenName] = useState("Best Kitchen");
    const [tagline, setTagline] = useState("Taste the Tradition, Feel the Love");
    const [description, setDescription] = useState("Authentic Arbic cuisine prepared with love and traditional recipes passed down through generations. We specialize in North Indian dishes with a modern twist.");
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [submitModalVisible, setSubmitModalVisible] = useState(false);

    // Determines if fields are editable. In existing code this might toggle.
    // Screenshot shows 'Edit' button top right, and inputs look active.
    const [isEditing, setIsEditing] = useState(true);

    const handleConfirmPress = () => {
        Keyboard.dismiss();
        setConfirmModalVisible(true);
    };

    const handleSave = () => {
        setConfirmModalVisible(false);
        // Show success/submit modal
        setSubmitModalVisible(true);
    };

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
                <Text style={styles.headerTitle}>Kitchen Information</Text>
                <Pressable onPress={() => setIsEditing(!isEditing)} style={styles.editBtn}>
                    <Text style={styles.editText}>Edit</Text>
                    <Ionicons name="create-outline" size={16} color="#600E10" />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* Warning Text */}
                <Text style={styles.warningText}>
                    If your kitchen is active, changes need admin approval. If it's in draft, changes update instantly.
                </Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Kitchen Name</Text>
                    <TextInput
                        style={styles.input}
                        value={kitchenName}
                        onChangeText={setKitchenName}
                        placeholder="Enter kitchen name"
                        editable={isEditing}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Kitchen Tagline</Text>
                    <TextInput
                        style={styles.input}
                        value={tagline}
                        onChangeText={setTagline}
                        placeholder="Tagline"
                        editable={isEditing}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Kitchen onboarding Date</Text>
                    <View style={styles.disabledInputContainer}>
                        <Text style={styles.disabledInputText}>January 15, 2024</Text>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Kitchen Bio</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Bio..."
                        multiline
                        textAlignVertical="top"
                        editable={isEditing}
                    />
                </View>

                <Pressable style={styles.saveBtn} onPress={handleConfirmPress}>
                    <Text style={styles.saveText}>Confirm</Text>
                </Pressable>
            </ScrollView>

            {/* Confirm Changes Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={confirmModalVisible}
                onRequestClose={() => setConfirmModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModalContent}>
                        <Pressable onPress={() => setConfirmModalVisible(false)} style={styles.closeIcon}>
                            <Ionicons name="close" size={24} color="#333" />
                        </Pressable>

                        <Text style={styles.modalTitle}>Confirm Changes</Text>
                        <Text style={styles.modalDesc}>
                            Are you sure you want to save these changes?
                        </Text>

                        <View style={styles.modalActions}>
                            <Pressable style={styles.modalCancelBtn} onPress={() => setConfirmModalVisible(false)}>
                                <Text style={styles.modalCancelText}>No</Text>
                            </Pressable>
                            <Pressable style={styles.modalConfirmBtn} onPress={handleSave}>
                                <Text style={styles.modalConfirmText}>Yes</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Submit Success Modal ('Submit Request') */}
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
        backgroundColor: '#F4F7FC', // Matching the slight blue tint
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
        fontSize: 20, // Slightly bigger, bolder
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8906C',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
        gap: 5,
    },
    editText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: '#1A1A1A',
    },
    content: {
        padding: 24,
    },
    warningText: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: '#1A1A1A',
        lineHeight: 20,
        marginBottom: 25,
        opacity: 0.8,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15, // Slightly bigger
        fontFamily: 'Poppins_600SemiBold', // Bolder label
        color: '#1A1A1A', // Dark
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    disabledInputContainer: {
        backgroundColor: '#D1D5DB', // Grey background as per screenshot
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    disabledInputText: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#6B7280', // Grey text
    },
    textArea: {
        minHeight: 120,
        paddingTop: 15,
    },
    saveBtn: {
        backgroundColor: '#4E0D0F', // Dark Red
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
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

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)', // Darker overlay
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
        borderColor: '#E8906C', // Orange tint border
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#000',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
    },
    modalConfirmBtn: {
        flex: 1,
        backgroundColor: '#4E0D0F', // Dark Red
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
    },
    modalConfirmText: {
        color: '#FFF',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
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
});
