
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import CustomModal from '@/components/CustomModal';

export default function KitchenDetailsScreen() {
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [bio, setBio] = useState('');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleConfirm = () => {
        if (!name) return Alert.alert('Error', 'Kitchen name is required');
        setShowModal(true);
    };

    const handleFinalSubmit = () => {
        setShowModal(false);
        router.back();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButtonIcon}>
                        <Ionicons name="chevron-back" size={28} color="#5C1414" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Kitchen Information</Text>
                </View>

                <Text style={styles.infoText}>
                    If your kitchen is active, changes need admin approval. If it's in draft, changes update instantly.
                </Text>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kitchen Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type Here"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kitchen Tagline (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type Here"
                            value={tagline}
                            onChangeText={setTagline}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kitchen Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Type Here"
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            numberOfLines={4}
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                {/* Footer Button */}
                <Pressable
                    style={[styles.confirmButton, !name && styles.disabledButton]}
                    onPress={handleConfirm}
                    disabled={!name}
                >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </Pressable>

                <CustomModal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    title="Submit Request"
                    message="Your kitchen is in active, so it has been submitted to the Riwayat Team for approval."
                    onReject={() => setShowModal(false)}
                    onAccept={handleFinalSubmit}
                    rejectLabel="Cancel"
                    acceptLabel="Done"
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FAFF',
    },
    scrollContent: {
        padding: 24,
        paddingTop: 60,
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButtonIcon: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#5C1414',
    },
    infoText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        lineHeight: 20,
        marginBottom: 32,
    },
    form: {
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        color: '#1A1A1A',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    confirmButton: {
        backgroundColor: '#5C1414',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
    disabledButton: {
        opacity: 0.6,
    },
});
