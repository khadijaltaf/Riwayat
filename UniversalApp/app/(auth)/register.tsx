
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
    const [phone, setPhone] = useState('');
    const router = useRouter();

    const handleSendVerification = () => {
        Keyboard.dismiss();
        if (!phone) return alert('Please enter your mobile number');
        // Logic to send OTP would go here. For now, navigate to verify screen.
        router.push({ pathname: '/(auth)/verify', params: { phone } });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header with Phone Icon and Step */}
                <View style={styles.header}>
                    <Text style={styles.stepText}>1/6</Text>
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
                    <TextInput
                        style={styles.input}
                        placeholder="0333"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, !phone && styles.disabledButton]}
                        onPress={handleSendVerification}
                        disabled={!phone}
                    >
                        <Text style={styles.nextButtonText}>Send verification</Text>
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
        opacity: 0.7,
    },
});
