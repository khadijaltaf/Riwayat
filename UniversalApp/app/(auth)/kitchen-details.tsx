
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '@/lib/supabase';

export default function KitchenDetailsScreen() {
    const [kitchenName, setKitchenName] = useState('');
    const [tagline, setTagline] = useState('');
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [showTaglineInfo, setShowTaglineInfo] = useState(false);
    const router = useRouter();

    const handleContinue = async () => {
        Keyboard.dismiss();
        if (!kitchenName) return Alert.alert('Error', 'Please enter your kitchen name');

        // Save to Supabase
        try {
            const { error } = await supabase.from('onboarding_sessions').update({
                kitchen_name: kitchenName,
                kitchen_tagline: tagline,
                updated_at: new Date()
            }).eq('phone', phone);

            if (error) console.warn('Supabase save error:', error);
        } catch (e) {
            console.error(e);
        }

        // Navigate to Screen 11: Kitchen Location
        router.push({ pathname: '/(auth)/location', params: { phone } });
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
                        <Ionicons name="restaurant" size={24} color="#600E10" />
                    </View>
                </View>

                {/* Title and Subtitle */}
                <Text style={styles.title}>Kitchen Details</Text>
                <Text style={styles.subtitle}>
                    Introduce your kitchen to the world!{'\n'}
                    Share a name, a story, and a few pictures
                </Text>

                {/* Form Fields */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name of Your Kitchen</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Mama's Kitchen, Spice Corner"
                            value={kitchenName}
                            onChangeText={setKitchenName}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Kitchen Tagline (Optional)</Text>
                            <Pressable onPress={() => setShowTaglineInfo(!showTaglineInfo)}>
                                <Ionicons name="information-circle-outline" size={20} color="#666" />
                                <Text style={styles.knowMoreText}>Click here to know more</Text>
                            </Pressable>
                        </View>

                        {showTaglineInfo && (
                            <View style={styles.infoPopup}>
                                <Pressable
                                    style={styles.closeInfo}
                                    onPress={() => setShowTaglineInfo(false)}
                                >
                                    <Ionicons name="close" size={18} color="#1A1A1A" />
                                </Pressable>
                                <Text style={styles.infoPopupText}>
                                    Your tagline is a short, catchy phrase that describes your kitchen's unique personality or specialty.
                                </Text>
                            </View>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Add Kitchen tagline"
                            value={tagline}
                            onChangeText={setTagline}
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, !kitchenName && styles.disabledButton]}
                        onPress={handleContinue}
                        disabled={!kitchenName}
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
        position: 'relative',
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
    },
    knowMoreText: {
        fontSize: 10,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginLeft: 4,
        position: 'absolute',
        right: -100, // Just a visual guide text
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
    infoPopup: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 15,
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        zIndex: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    closeInfo: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    infoPopupText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#4A4A4A',
        lineHeight: 20,
        paddingRight: 20,
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
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
    },
    nextButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 30,
        backgroundColor: '#5C1414',
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    disabledButton: {
        opacity: 0.5,
    },
});
