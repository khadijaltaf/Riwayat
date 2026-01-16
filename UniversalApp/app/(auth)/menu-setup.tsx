import React from 'react';
import { StyleSheet, View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function MenuSetupScreen() {
    const router = useRouter();

    const handleContinue = () => {
        // Navigate to Step 5: ID Verification
        router.push('/(auth)/id-verification');
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
                    <Text style={styles.stepText}>5/6</Text>
                    <View style={styles.iconContainer}>
                        <Ionicons name="book" size={24} color="#600E10" />
                    </View>
                </View>

                {/* Title and Subtitle */}
                <Text style={styles.title}>Menu Setup</Text>
                <Text style={styles.subtitle}>
                    Riwayat Team will get in touch with you for Menu setup after you submit Kitchen Application <Text style={styles.approvedText}>Approved</Text>
                </Text>

                {/* Tip Box */}
                <View style={styles.tipBox}>
                    <Text style={styles.tipTitle}>Tip: <Text style={styles.tipText}>For each dish, you'll need to provide pictures, a short story and details. You can start preparing these while waiting for approval!</Text></Text>
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={styles.nextButton}
                        onPress={handleContinue}
                    >
                        <Text style={styles.nextButtonText}>Continue</Text>
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
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#4A4A4A',
        lineHeight: 24,
        marginBottom: 32,
    },
    approvedText: {
        color: '#2E7D32',
        fontFamily: 'Poppins_700Bold',
    },
    tipBox: {
        backgroundColor: '#FFEFE6',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E8906C',
        marginBottom: 40,
    },
    tipTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#E8906C',
        lineHeight: 24,
    },
    tipText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#E8906C',
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
});
