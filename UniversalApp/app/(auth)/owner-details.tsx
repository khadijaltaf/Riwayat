import SelectionBottomSheet from '@/components/SelectionBottomSheet';
import { api } from '@/lib/api-client';
import { localStorageService } from '@/services/local-storage-service';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function OwnerDetailsScreen() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAgent, setIsAgent] = useState(false);
    const [relationship, setRelationship] = useState('');
    const [showSelection, setShowSelection] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        const progress = await localStorageService.getOnboardingProgress();
        if (progress?.full_name) setName(progress.full_name);
        if (progress?.owner_email) setEmail(progress.owner_email);
        if (progress?.is_agent !== undefined) setIsAgent(progress.is_agent);
        if (progress?.relationship) setRelationship(progress.relationship);
    };

    const relationships = ['Family Member', 'Employee', 'Partner', 'Friend', 'Other'];

    const handleSelectRelationship = () => {
        setShowSelection(true);
    };

    const handleContinue = async () => {
        Keyboard.dismiss();
        if (!name) return Alert.alert('Error', 'Please enter the owner name');
        if (isAgent && !relationship) return Alert.alert('Error', 'Please select your relationship');

        // Final save to local storage & Supabase
        setLoading(true);
        try {
            await localStorageService.saveOnboardingProgress({
                phone,
                full_name: name,
                owner_email: email,
                is_agent: isAgent,
                relationship: isAgent ? relationship : null,
                step: 'kitchen_details'
            });

            const { error } = await api.onboarding.updateSession({
                phone,
                full_name: name,
                owner_email: email,
                is_agent: isAgent,
                relationship: isAgent ? relationship : null,
                step: 'kitchen_details',
                updated_at: new Date().toISOString()
            });
            if (error) console.warn('API save error:', error);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }

        // Navigate to Dashboard (Root Tabs)
        // Navigate to Kitchen Details
        router.push({ pathname: '/(auth)/kitchen-details', params: { phone } });
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
                    <Text style={styles.stepText}>1/6</Text>
                    <View style={styles.iconContainer}>
                        <Ionicons name="person" size={24} color="#600E10" />
                    </View>
                </View>

                {/* Title and Subtitle */}
                <Text style={styles.title}>Owner Details</Text>
                <Text style={styles.subtitle}>
                    Provide the kitchen owner's information for verification
                </Text>

                {/* Form Fields */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Owner Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type Here"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Owner Email (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type Here"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            placeholderTextColor="#999"
                        />
                        <Text style={styles.infoText}>
                            This email will be used for sending notifications and alerts, so we really recommend to give correct email
                        </Text>
                    </View>

                    {/* Agent Checkbox */}
                    <Pressable
                        style={styles.checkboxRow}
                        onPress={() => setIsAgent(!isAgent)}
                    >
                        <View style={[styles.checkbox, isAgent && styles.checkboxSelected]}>
                            {isAgent && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                        </View>
                        <Text style={styles.checkboxLabel}>
                            Are you registering kitchen on behalf of someone else?
                        </Text>
                    </Pressable>

                    {/* Relationship Dropdown (Conditional) */}
                    {isAgent && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Relationship with primary chef</Text>
                            <Pressable style={styles.dropdown} onPress={handleSelectRelationship}>
                                <Text style={[styles.dropdownText, !relationship && styles.placeholderText]}>
                                    {relationship || '--Select--'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#1A1A1A" />
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, (!name || loading) && styles.disabledButton]}
                        onPress={handleContinue}
                        disabled={!name || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.nextButtonText}>Continue</Text>
                        )}
                    </Pressable>
                </View>

                <SelectionBottomSheet
                    visible={showSelection}
                    onClose={() => setShowSelection(false)}
                    title="Relationship"
                    items={relationships}
                    onSelect={(item) => setRelationship(item)}
                    placeholder="Search Relationship"
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
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        color: '#4A4A4A',
        lineHeight: 26,
        marginBottom: 32,
    },
    form: {
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 24,
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
    infoText: {
        fontSize: 13,
        color: '#666',
        marginTop: 8,
        lineHeight: 18,
        fontFamily: 'Poppins_400Regular',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
        paddingRight: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#600E10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#600E10',
    },
    checkboxLabel: {
        fontSize: 15,
        color: '#600E10',
        fontFamily: 'Poppins_600SemiBold',
        flex: 1,
    },
    dropdown: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    dropdownText: {
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
    },
    placeholderText: {
        color: '#999',
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
