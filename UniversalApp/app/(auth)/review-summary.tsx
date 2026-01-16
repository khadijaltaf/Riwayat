import React from 'react';
import { StyleSheet, View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function ReviewSummaryScreen() {
    const router = useRouter();

    const handleSend = () => {
        // Navigate to final screen
        router.push('/(auth)/onboarding-complete');
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
                    <Text style={styles.stepText}>6/6</Text>
                    <View style={styles.iconContainer}>
                        <Ionicons name="checkmark-circle" size={24} color="#600E10" />
                    </View>
                </View>

                {/* Title and Subtitle */}
                <Text style={styles.title}>Send for Approval</Text>
                <Text style={styles.subtitle}>
                    Review your information and submit for approval
                </Text>

                {/* Summary Cards */}
                <View style={styles.summaryList}>
                    <SummaryCard title="Owner Details" onEdit={() => router.push('/(auth)/owner-details')} />
                    <SummaryCard title="Kitchen Details" onEdit={() => router.push('/(auth)/kitchen-details')} />
                    <SummaryCard title="Kitchen Location" onEdit={() => router.push('/(auth)/location')} />
                    <SummaryCard title="Identity Documents" onEdit={() => router.push('/(auth)/id-verification')} />
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={styles.nextButton}
                        onPress={handleSend}
                    >
                        <Text style={styles.nextButtonText}>Send</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function SummaryCard({ title, onEdit }: { title: string; onEdit: () => void }) {
    return (
        <View style={styles.summaryCard}>
            <View style={styles.summaryInfo}>
                <Ionicons name="checkmark" size={20} color="#2E7D32" />
                <Text style={styles.summaryTitle}>{title}</Text>
            </View>
            <Pressable onPress={onEdit}>
                <Ionicons name="pencil-outline" size={20} color="#600E10" />
            </Pressable>
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#4A4A4A',
        lineHeight: 24,
        marginBottom: 32,
    },
    summaryList: {
        gap: 15,
        marginBottom: 40,
    },
    summaryCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    summaryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    summaryTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#600E10',
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
