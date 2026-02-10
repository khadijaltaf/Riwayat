import OTPInput from '@/components/OTPInput';
import { api } from '@/lib/api-client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginOTPScreen() {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendOTP = async () => {
        Keyboard.dismiss();
        if (!phone) return Alert.alert('Error', 'Please enter your phone number');

        setLoading(true);

        try {
            // Local Fake OTP for Login
            const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
            setGeneratedOtp(newOtp);

            setLoading(false);
            setStep('otp');
            Alert.alert('OTP Sent', `Verification code is: ${newOtp}`);

        } catch (e: any) {
            setLoading(false);
            Alert.alert('Error', e.message);
        }
    };

    const handleVerifyOTP = async () => {
        Keyboard.dismiss();
        if (otp.length < 4) return Alert.alert('Error', 'Please enter the 4-digit OTP');

        if (otp !== generatedOtp && otp !== '1234') {
            return Alert.alert('Invalid OTP', `The verification code you entered is incorrect. (Hint: ${generatedOtp})`);
        }

        setLoading(true);

        try {
            // Verify OTP via API
            const { data, error } = await api.auth.verifyOtp({ phone, token: otp });

            if (error || !data?.user) {
                setLoading(false);
                return Alert.alert('Login Failed', error?.message || 'Verification failed');
            }

            // Check if profile exists
            const { data: profile } = await api.profile.get(data.user.id);

            if (profile) {
                setLoading(false);
                router.replace('/(tabs)');
            } else {
                setLoading(false);
                Alert.alert(
                    'Profile Not Found',
                    'It seems you have not completed registration yet.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Register', onPress: () => router.push('/(auth)/register' as any) }
                    ]
                );
            }

        } catch (e: any) {
            setLoading(false);
            Alert.alert('Error', e.message);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* Back Button and Phone Icon */}
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => step === 'otp' ? setStep('phone') : router.back()}>
                        <Ionicons name="chevron-back" size={28} color="#600E10" />
                        <Text style={styles.backText}>Back</Text>
                    </Pressable>
                    <Pressable style={styles.callButton}>
                        <Ionicons name="call" size={24} color="#600E10" />
                    </Pressable>
                </View>

                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <Image
                        source={require('../../assets/images/app_logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.logoText}>RIWAYAT</Text>
                </View>

                {/* Welcome Text */}
                <View style={styles.textSection}>
                    <Text style={styles.welcomeTitle}>Login with OTP</Text>
                    <Text style={styles.welcomeSubtitle}>
                        {step === 'phone' ? 'Enter your phone number to receive OTP' : 'Enter the OTP sent to your phone'}
                    </Text>
                </View>

                {/* Input Fields */}
                <View style={styles.form}>
                    {step === 'phone' ? (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <View style={styles.phoneInputContainer}>
                                <View style={styles.countryCodeContainer}>
                                    <Image
                                        source={{ uri: 'https://flagcdn.com/w40/pk.png' }}
                                        style={{ width: 24, height: 16, marginRight: 8 }}
                                    />
                                    <Text style={styles.countryCodeText}>+92</Text>
                                </View>
                                <TextInput
                                    style={styles.phoneInput}
                                    placeholder="300 1234567"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    placeholderTextColor="#999"
                                    maxLength={10}
                                />
                            </View>
                        </View>
                    ) : (
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
                </View>

                {/* Action Button */}
                <Pressable
                    style={[styles.loginButton, loading && styles.disabledButton]}
                    onPress={step === 'phone' ? handleSendOTP : handleVerifyOTP}
                    disabled={loading}
                >
                    <Text style={styles.loginButtonText}>
                        {loading ? 'Please wait...' : step === 'phone' ? 'Send OTP' : 'Verify & Login'}
                    </Text>
                </Pressable>

                {/* Sign up Link */}
                <Pressable
                    style={styles.signupLink}
                    onPress={() => router.push('/(auth)/register' as any)}
                >
                    <Text style={styles.signupText}>
                        Don't have an account? <Text style={styles.signupBold}>Sign up</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    callButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoImage: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    logoText: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
        letterSpacing: 2,
    },
    textSection: {
        marginBottom: 40,
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#D84315',
        marginBottom: 4,
    },
    welcomeSubtitle: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        textAlign: 'center',
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
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
        paddingRight: 12,
        marginRight: 12,
        height: '100%',
        paddingVertical: 12,
    },
    countryCodeText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
    },
    phoneInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
        height: 50,
    },
    loginButton: {
        backgroundColor: '#600E10',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 40,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
    disabledButton: {
        opacity: 0.7,
    },
    signupLink: {
        alignItems: 'center',
        marginTop: 'auto',
    },
    signupText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
    },
    signupBold: {
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
        textDecorationLine: 'underline',
    },
});
