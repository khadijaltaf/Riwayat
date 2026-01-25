
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import OTPInput from '@/components/OTPInput';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import * as ExpoCrypto from 'expo-crypto';

export default function PinSetupScreen() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleContinue = async () => {
        Keyboard.dismiss();
        if (pin.length < 4) return setError('PIN must be at least 4 digits');
        if (pin !== confirmPin) return setError('PIN does not match. Please try again.');

        setError('');
        setLoading(true);

        try {
            // Hash the PIN using standard SHA-256 (sufficient for 4-digit PIN in this context)
            const hashedPin = await ExpoCrypto.digestStringAsync(
                ExpoCrypto.CryptoDigestAlgorithm.SHA256,
                pin
            );

            const { error } = await supabase.from('onboarding_sessions').update({
                temp_pin_hash: hashedPin,
                step: 'owner_details',
                updated_at: new Date()
            }).eq('phone', phone);

            if (error) {
                console.warn('Supabase save error:', error);
                // Optionally handle error (e.g., retry or show alert) but we proceed for now
            }

            // Navigate to Screen 7: Owner Details
            router.push({ pathname: '/(auth)/owner-details', params: { phone } });

        } catch (e) {
            console.error('PIN Hashing or Save Error:', e);
            setError('Failed to save PIN. Please try again.');
        } finally {
            setLoading(false);
        }
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
                    <Text style={styles.stepText}>2/6</Text>
                    <View style={styles.iconContainer}>
                        <Ionicons name="lock-closed" size={24} color="#600E10" />
                    </View>
                </View>

                {/* Title and Subtitle */}
                <Text style={styles.title}>PIN Setup</Text>
                <Text style={styles.subtitle}>
                    This is also your Password to login
                </Text>

                {/* PIN Inputs */}
                <View style={styles.inputSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Set Your PIN</Text>
                        <OTPInput
                            value={pin}
                            onChange={(text) => {
                                setPin(text);
                                if (error) setError('');
                            }}
                            length={4}
                            secureTextEntry={true}
                            autoFocus={true}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Your PIN</Text>
                        <OTPInput
                            value={confirmPin}
                            onChange={(text) => {
                                setConfirmPin(text);
                                if (error) setError('');
                            }}
                            length={4}
                            secureTextEntry={true}
                            autoFocus={false}
                        />
                    </View>

                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, (!pin || !confirmPin || loading) && styles.disabledButton]}
                        onPress={handleContinue}
                        disabled={!pin || !confirmPin || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.nextButtonText}>Continue</Text>
                        )}
                    </Pressable>
                </View>
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
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    stepText: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        color: '#4A4A4A',
        lineHeight: 26,
        marginBottom: 40,
    },
    inputSection: {
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
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
        padding: 18,
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        color: '#1A1A1A',
    },
    errorText: {
        color: '#FF0000',
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 'auto',
    },
    backButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    backButtonText: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
    },
    nextButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 30,
        backgroundColor: '#600E10',
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    disabledButton: {
        opacity: 0.5,
    },
});
