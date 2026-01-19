
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '@/lib/supabase';

export default function LocationScreen() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [area, setArea] = useState('');
    const router = useRouter();

    const handleContinue = async () => {
        Keyboard.dismiss();
        if (!address || !city) return Alert.alert('Error', 'Please enter your address and city');

        // Save to Supabase
        try {
            const { error } = await supabase.from('onboarding_sessions').update({
                address: address,
                city: city,
                area: area,
                updated_at: new Date()
            }).eq('phone', phone);

            if (error) console.warn('Supabase save error:', error);
        } catch (e) {
            console.error(e);
        }

        // Navigate to Screen: Menu Setup
        router.push({ pathname: '/(auth)/menu-setup', params: { phone } });
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
                    <Text style={styles.stepText}>4/6</Text>
                    <View style={styles.iconContainer}>
                        <Ionicons name="location" size={24} color="#600E10" />
                    </View>
                </View>

                {/* Title and Subtitle */}
                <Text style={styles.title}>Kitchen Location</Text>
                <Text style={styles.subtitle}>
                    Enter your location details
                </Text>

                {/* Form Fields */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>House No / Street</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type Here"
                            value={address}
                            onChangeText={setAddress}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Area / Sector</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type Here"
                            value={area}
                            onChangeText={setArea}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type Here"
                            value={city}
                            onChangeText={setCity}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Google Map Location Link (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your kitchen's full address"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.mapPreviewSection}>
                        <Text style={styles.label}>Live Map Preview</Text>
                        <View style={styles.mapBox}>
                            <View style={styles.mapIconCircle}>
                                <Ionicons name="location" size={30} color="#600E10" />
                            </View>
                            <Text style={styles.mapTip}>Add Google Maps link to view location</Text>
                        </View>
                    </View>
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, (!address || !city) && styles.disabledButton]}
                        onPress={handleContinue}
                        disabled={!address || !city}
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
    mapPreviewSection: {
        marginBottom: 30,
    },
    mapBox: {
        height: 180,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F4FAFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    mapTip: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#999',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 20,
        paddingBottom: 20,
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
