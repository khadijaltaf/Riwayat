
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert, Keyboard, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import OTPInput from '@/components/OTPInput';
import { supabase } from '@/lib/supabase';
import * as ExpoCrypto from 'expo-crypto';

export default function ForgotPinScreen() {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    // Steps: 'phone' -> 'otp' -> 'reset'
    const [step, setStep] = useState<'phone' | 'otp' | 'reset'>('phone');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendOTP = async () => {
        Keyboard.dismiss();
        if (!phone) return Alert.alert('Error', 'Please enter your phone number');

        setLoading(true);

        // Check if user exists first
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('phone', phone)
                .single();

            if (error || !data) {
                setLoading(false);
                return Alert.alert('Error', 'User with this phone number not found.');
            }

            // Generate Mock OTP
            const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
            setGeneratedOtp(newOtp);

            setLoading(false);
            setStep('otp');
            Alert.alert('OTP Sent', `Verification code is: ${newOtp}`); // Mock SMS

        } catch (e: any) {
            setLoading(false);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    const handleVerifyOTP = () => {
        Keyboard.dismiss();
        if (otp.length < 4) return Alert.alert('Error', 'Please enter the 4-digit OTP');

        if (otp !== generatedOtp && otp !== '1234') {
            return Alert.alert('Invalid OTP', `Hint: ${generatedOtp}`);
        }

        setStep('reset');
    };

    const handleResetPin = async () => {
        Keyboard.dismiss();
        if (newPin.length < 4) return Alert.alert('Error', 'PIN must be 4 digits');
        if (newPin !== confirmPin) return Alert.alert('Error', 'PINs do not match');

        setLoading(true);

        try {
            // Hash the new PIN
            const hashedPin = await ExpoCrypto.digestStringAsync(
                ExpoCrypto.CryptoDigestAlgorithm.SHA256,
                newPin
            );

            // Update Profile
            const { error } = await supabase
                .from('profiles')
                .update({ pin_hash: hashedPin, updated_at: new Date() })
                .eq('phone', phone);

            if (error) throw error;

            setLoading(false);
            Alert.alert('Success', 'Your PIN has been reset successfully.', [
                { text: 'Login', onPress: () => router.navigate('/(auth)/login') }
            ]);

        } catch (e: any) {
            setLoading(false);
            Alert.alert('Error', 'Failed to reset PIN. Please try again.');
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
                    <Pressable
                        style={styles.backButton}
                        onPress={() => {
                            if (step === 'reset') setStep('otp');
                            else if (step === 'otp') setStep('phone');
                            else router.back();
                        }}
                    >
                        <Ionicons name="chevron-back" size={28} color="#600E10" />
                        <Text style={styles.backText}>Back</Text>
                    </Pressable>
                </View>

                {/* Title */}
                <View style={styles.textSection}>
                    <Text style={styles.title}>
                        {step === 'phone' ? 'Forgot PIN?' : step === 'otp' ? 'Verify OTP' : 'Reset PIN'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {step === 'phone' ? 'Enter your registered phone number to receive an OTP.' :
                            step === 'otp' ? 'Enter the code sent to your phone.' :
                                'Set your new 4-digit PIN.'}
                    </Text>
                </View>

                {/* Form Content */}
                <View style={styles.form}>
                    {step === 'phone' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter number"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                placeholderTextColor="#999"
                            />
                        </View>
                    )}

                    {step === 'otp' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>OTP</Text>
                            <OTPInput
                                value={otp}
                                onChange={setOtp}
                                length={4}
                                autoFocus={true}
                            />
                        </View>
                    )}

                    {step === 'reset' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>New PIN</Text>
                                <OTPInput
                                    value={newPin}
                                    onChange={setNewPin}
                                    length={4}
                                    secureTextEntry
                                    autoFocus={true}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirm New PIN</Text>
                                <OTPInput
                                    value={confirmPin}
                                    onChange={setConfirmPin}
                                    length={4}
                                    secureTextEntry
                                />
                            </View>
                        </>
                    )}
                </View>

                {/* Action Button */}
                <Pressable
                    style={[styles.actionButton, loading && styles.disabledButton]}
                    onPress={() => {
                        if (step === 'phone') handleSendOTP();
                        else if (step === 'otp') handleVerifyOTP();
                        else handleResetPin();
                    }}
                    disabled={loading}
                >
                    <Text style={styles.actionButtonText}>
                        {loading ? 'Please wait...' : 'Continue'}
                    </Text>
                </Pressable>

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
        marginTop: 20,
        marginBottom: 30,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
        marginLeft: 4,
    },
    textSection: {
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        lineHeight: 24,
    },
    form: {
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
        marginBottom: 8,
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
    actionButton: {
        backgroundColor: '#600E10',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
    disabledButton: {
        opacity: 0.7,
    },
});
