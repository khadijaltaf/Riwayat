import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '@/lib/supabase';

export default function ReviewSummaryScreen() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchSessionData();
    }, []);

    const fetchSessionData = async () => {
        try {
            const { data: session, error } = await supabase
                .from('onboarding_sessions')
                .select('*')
                .eq('phone', phone)
                .single();

            if (error) throw error;
            setData(session);
        } catch (e) {
            console.error('Error fetching session:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        Keyboard.dismiss();
        setSubmitting(true);
        // Final Status Update
        try {
            const { error } = await supabase.from('onboarding_sessions').update({
                application_status: 'SUBMITTED',
                updated_at: new Date()
            }).eq('phone', phone);

            if (error) throw error;
            // Navigate to final screen
            router.push('/(auth)/onboarding-complete');
        } catch (e: any) {
            console.error(e);
            Alert.alert('Error', e.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#600E10" />
            </View>
        );
    }

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
                    <SummaryCard
                        title="Owner Details"
                        details={`${data?.full_name || 'Not provided'}${data?.email ? '\n' + data.email : ''}`}
                        onEdit={() => router.push({ pathname: '/(auth)/owner-details', params: { phone } })}
                    />
                    <SummaryCard
                        title="Kitchen Details"
                        details={`${data?.kitchen_name || 'Not provided'}${data?.kitchen_tagline ? '\n' + data.kitchen_tagline : ''}`}
                        onEdit={() => router.push({ pathname: '/(auth)/kitchen-details', params: { phone } })}
                    />
                    <SummaryCard
                        title="Kitchen Location"
                        details={`${data?.address || 'Not provided'}, ${data?.area || ''}, ${data?.city || ''}`}
                        onEdit={() => router.push({ pathname: '/(auth)/location', params: { phone } })}
                    />
                    <SummaryCard
                        title="Identity Documents"
                        details={`CNIC: ${data?.cnic_number || 'Pending'}${data?.ntn_number ? '\nNTN: ' + data.ntn_number : ''}`}
                        imageUri={data?.cnic_image_url}
                        onEdit={() => router.push({ pathname: '/(auth)/id-verification', params: { phone } })}
                    />
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, submitting && styles.disabledButton]}
                        onPress={handleSend}
                        disabled={submitting}
                    >
                        <Text style={styles.nextButtonText}>
                            {submitting ? 'Submitting...' : 'Send'}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function SummaryCard({ title, details, imageUri, onEdit }: { title: string; details: string; imageUri?: string; onEdit: () => void }) {
    return (
        <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
                <View style={styles.summaryInfo}>
                    <Ionicons name="checkmark" size={20} color="#2E7D32" />
                    <Text style={styles.summaryTitle}>{title}</Text>
                </View>
                <Pressable onPress={onEdit} style={styles.editButton}>
                    <Ionicons name="pencil-outline" size={18} color="#600E10" />
                </Pressable>
            </View>
            <View style={styles.summaryContent}>
                <Text style={styles.summaryDetails}>{details}</Text>
                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.summaryImage} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FAFF',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    summaryTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    summaryContent: {
        paddingLeft: 30,
    },
    summaryDetails: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#4A4A4A',
        lineHeight: 20,
    },
    summaryImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginTop: 12,
        backgroundColor: '#F0F0F0',
    },
    editButton: {
        padding: 4,
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
