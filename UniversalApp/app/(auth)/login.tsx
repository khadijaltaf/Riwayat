import { api } from '@/lib/api-client';
import { localStorageService } from '@/services/local-storage-service';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
    const [phone, setPhone] = useState('+92');
    const [pin, setPin] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        loadRememberedPhone();
    }, []);

    const loadRememberedPhone = async () => {
        const savedPhone = await localStorageService.getRememberedPhone();
        if (savedPhone) {
            setPhone(savedPhone);
            setRememberMe(true);
        }
    };

    const handleLogin = async () => {
        Keyboard.dismiss();
        if (!phone || !pin) return Alert.alert('Error', 'Please enter both phone number and PIN');

        setLoading(true);

        try {
            // Normalize phone number (optional, depending on how strict we want to be)
            const formattedPhone = phone.startsWith('0')
                ? '+92' + phone.substring(1).replace(/\s/g, '')
                : phone.startsWith('+92')
                    ? phone.replace(/\s/g, '')
                    : '+92' + phone.replace(/\s/g, '');

            const { data, error } = await api.auth.loginWithPin({
                phone: formattedPhone,
                pin
            });

            if (error || !data?.session) {
                // Check if user exists but has no PIN
                const { data: profile } = await api.profile.getByPhone(formattedPhone);
                if (profile && !profile.pin_hash) {
                    Alert.alert(
                        'PIN Required',
                        'You have not set a PIN yet. Please set one now.',
                        [
                            {
                                text: 'Set PIN',
                                onPress: () => router.push({ pathname: '/(auth)/forgot-pin', params: { phone: formattedPhone } })
                            },
                            { text: 'Cancel', style: 'cancel' }
                        ]
                    );
                    setLoading(false);
                    return;
                }

                throw new Error(error?.message || 'Login failed');
            }

            // Save phone if Remember Me is checked
            if (rememberMe) {
                await localStorageService.saveRememberedPhone(phone);
            } else {
                await localStorageService.clearRememberedPhone();
            }

            setLoading(false);
            router.replace('/(tabs)');

        } catch (e: any) {
            setLoading(false);
            Alert.alert('Login Failed', e.message || 'An unexpected error occurred');
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
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
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
                    <Text style={styles.welcomeTitle}>Welcome to Riwayat</Text>
                    <Text style={styles.welcomeSubtitle}>your home for warm, homemade taste.</Text>
                </View>

                {/* Input Fields */}
                <View style={styles.form}>
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PIN</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter PIN"
                            value={pin}
                            onChangeText={setPin}
                            secureTextEntry
                            keyboardType="number-pad"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.optionsRow}>
                        <Pressable
                            style={styles.checkboxContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <Ionicons
                                name={rememberMe ? "checkbox" : "square-outline"}
                                size={22}
                                color="#E8906C"
                            />
                            <Text style={styles.optionText}>Remember me</Text>
                        </Pressable>
                        <Pressable onPress={() => router.push('/(auth)/forgot-pin' as any)}>
                            <Text style={styles.forgotText}>Forgot PIN?</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Login Button */}
                <Pressable
                    style={[styles.loginButton, loading && styles.disabledButton]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.loginButtonText}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Text>
                </Pressable>

                {/* Login with OTP */}
                <Pressable
                    style={styles.otpButton}
                    onPress={() => router.push('/(auth)/login-otp' as any)}
                >
                    <Text style={styles.otpButtonText}>Login with OTP</Text>
                </Pressable>

                {/* Sign up Link */}
                <Pressable
                    style={styles.signupLink}
                    onPress={() => router.push('/(auth)/register' as any)}
                >
                    <Text style={styles.signupText}>
                        <Text style={styles.signupBold}>Sign up</Text> as a home chef
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
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    optionText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
    },
    forgotText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
    },
    forgotLink: {
        textDecorationLine: 'underline',
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
    otpButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#600E10',
    },
    otpButtonText: {
        color: '#600E10',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
});
