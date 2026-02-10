import { api } from '@/lib/api-client';
import { localStorageService } from '@/services/local-storage-service';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        const progress = await localStorageService.getOnboardingProgress();
        if (progress?.phone) {
            setPhone(progress.phone.replace('+92', ''));
        }
    };

    const handleSendVerification = async () => {
        Keyboard.dismiss();
        if (!phone) return alert('Please enter your mobile number');

        setLoading(true);

        // Simulate sending OTP locally to bypass SMS provider issues
        const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

        // Clean phone for consistency
        const formattedPhone = phone.startsWith('0')
            ? '+92' + phone.substring(1).replace(/\s/g, '')
            : '+92' + phone.replace(/\s/g, '');

        // 1. Clean phone for storage consistency (keep 0 prefix if present or standardized)
        const cleanPhone = phone.trim();

        try {
            // 2. Save to Local Storage for Persistence
            await localStorageService.saveOnboardingProgress({
                phone: formattedPhone,
                step: 'verify'
            });

            // 2. Save OTP to Mock Onboarding Session
            const { error } = await api.onboarding.updateSession({
                phone: formattedPhone,
                last_otp: generatedOtp,
                step: 'verify',
                updated_at: new Date().toISOString()
            });

            if (error) throw error;

            // Show the code and navigate
            Alert.alert('Verification Code', `Your OTP is: ${generatedOtp}`, [
                {
                    text: 'OK',
                    onPress: () => {
                        router.push({
                            pathname: '/(auth)/verify',
                            params: { phone: formattedPhone, actualOtp: generatedOtp }
                        });
                    }
                }
            ]);

        } catch (e: any) {
            console.warn('Failed to save OTP to Supabase:', e);
            Alert.alert('Error', 'Failed to initialize session. Please check your connection.');
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
                {/* Header with Phone Icon and Step */}
                <View style={styles.header}>
                    <View style={styles.phoneIconContainer}>
                        <Ionicons name="call" size={24} color="#600E10" />
                    </View>
                </View>

                {/* Welcome Title */}
                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.subtitle}>
                    Join our home chef community and share your tasty meals.
                </Text>

                {/* Benefit Items */}
                <View style={styles.benefits}>
                    <BenefitItem
                        icon="heart-outline"
                        text="Cook with passion, serve with love"
                    />
                    <BenefitItem
                        icon="people-outline"
                        text="Build your local food community"
                    />
                    <BenefitItem
                        icon="restaurant-outline"
                        text="Turn your kitchen into a business"
                    />
                </View>

                {/* Mobile Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Kitchen Owner Mobile Number</Text>
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

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, (!phone || loading) && styles.disabledButton]}
                        onPress={handleSendVerification}
                        disabled={!phone || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.nextButtonText}>Send</Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function BenefitItem({ icon, text }: { icon: any; text: string }) {
    return (
        <View style={styles.benefitItem}>
            <View style={styles.benefitIconWrapper}>
                <Ionicons name={icon} size={22} color="#E8906C" />
            </View>
            <Text style={styles.benefitText}>{text}</Text>
        </View>
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
    phoneIconContainer: {
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginBottom: 32,
        lineHeight: 24,
    },
    benefits: {
        gap: 20,
        marginBottom: 40,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    benefitIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFEFE6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    benefitText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#600E10',
    },
    inputSection: {
        marginBottom: 40,
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
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 16,
        paddingVertical: 4, // Adjust for inner text input height
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
        opacity: 0.7,
    },
});
