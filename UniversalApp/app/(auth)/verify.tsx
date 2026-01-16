
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import CustomModal from '@/components/CustomModal';
import { supabase } from '@/lib/supabase';

export default function VerifyScreen() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteData, setInviteData] = useState({ inviter: 'Asim', kitchen: 'Asim Pakwan' });
    const router = useRouter();

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = async () => {
        Keyboard.dismiss();
        if (otp.length < 4) return alert('Please enter a valid OTP');

        setLoading(true);

        // Save to Supabase (Mocking for now as per instructions to save even passwords/OTPs)
        try {
            const { error } = await supabase.from('onboarding_sessions').upsert({
                phone: phone,
                last_otp: otp,
                updated_at: new Date()
            });
            if (error) console.warn('Supabase save error:', error);
        } catch (e) {
            console.error(e);
        }

        // Logic for "Invitation Already Exists"
        // This is a simulation based on the design provided
        if (phone === '03337659240' || phone === '03001234567') {
            setLoading(false);
            setShowInviteModal(true);
            return;
        }

        setTimeout(() => {
            setLoading(false);
            router.push('/(auth)/pin-setup' as any);
        }, 1000);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.stepText}>1/6</Text>
                    <View style={styles.iconContainer}>
                        <Ionicons name="call" size={24} color="#600E10" />
                    </View>
                </View>

                {/* Title and Subtitle */}
                <Text style={styles.title}>Verify Your Number</Text>
                <Text style={styles.subtitle}>
                    Enter the 4-digit code sent to {'\n'}
                    <Text style={styles.phoneText}>{phone || '03337659240'}</Text>
                </Text>

                {/* OTP Input Section */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>OTP</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Type Here"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={4}
                        placeholderTextColor="#999"
                    />

                    <View style={styles.timerRow}>
                        <View style={styles.timerItem}>
                            <Ionicons name="time-outline" size={20} color="#1A1A1A" />
                            <Text style={styles.timerText}>{timer} Second</Text>
                        </View>
                        <Pressable
                            style={[styles.resendButton, timer > 0 && styles.disabledButton]}
                            disabled={timer > 0}
                            onPress={() => setTimer(60)}
                        >
                            <Text style={styles.resendText}>Resend</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, (otp.length < 4 || loading) && styles.disabledButton]}
                        onPress={handleVerify}
                        disabled={otp.length < 4 || loading}
                    >
                        <Text style={styles.nextButtonText}>
                            {loading ? 'Verifying...' : 'Verify'}
                        </Text>
                    </Pressable>
                </View>

                <CustomModal
                    visible={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                    title="Invitation Already Exists"
                    message={`This mobile number is already registered. You've been invited by ${inviteData.inviter} to join as a chef for the kitchen "${inviteData.kitchen}"`}
                    onReject={() => setShowInviteModal(false)}
                    onAccept={() => {
                        setShowInviteModal(false);
                        router.push('/(auth)/pin-setup' as any);
                    }}
                    rejectLabel="Reject"
                    acceptLabel="Accept"
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
        color: '#4A4A4A',
        lineHeight: 26,
        marginBottom: 40,
    },
    phoneText: {
        fontWeight: 'bold',
    },
    inputSection: {
        marginBottom: 40,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        color: '#1A1A1A',
    },
    timerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    timerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timerText: {
        fontSize: 16,
        color: '#1A1A1A',
        fontFamily: 'Poppins_600SemiBold',
    },
    resendButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F4FAFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    resendText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
    },
    footer: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 'auto',
    },
    backButton: {
        flex: 1,
        paddingVertical: 14,
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
        flex: 1.5,
        paddingVertical: 14,
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
