
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '@/context/onboarding';

export default function KitchenProfileScreen() {
    const { data, updateData } = useOnboarding();
    const [kitchenName, setKitchenName] = useState(data.kitchenName);
    const [description, setDescription] = useState(data.description);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleNext = () => {
        if (!kitchenName) return alert('Please enter your kitchen name');
        if (!description) return alert('Please enter a short description');
        updateData({ kitchenName, description });
        router.push('/(auth)/location');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="restaurant" size={24} color="#5C1414" />
                    </View>
                    <Text style={styles.stepText}>2/6</Text>
                </View>

                <Text style={styles.title}>Kitchen Profile</Text>
                <Text style={styles.subtitle}>
                    Tell us about your kitchen. This is what customers will see.
                </Text>

                <View style={styles.inputGroup}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Kitchen Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Grandma's Spices"
                            value={kitchenName}
                            onChangeText={setKitchenName}
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Tell customers what's special about your food..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, (!kitchenName || !description) && styles.disabledButton]}
                        onPress={handleNext}
                        disabled={!kitchenName || !description}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
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
        marginBottom: 24,
        marginTop: 20,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    stepText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#800000',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#5C1414',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
        lineHeight: 24,
    },
    inputGroup: {
        gap: 20,
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#1A1A1A',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
        gap: 16,
    },
    backButton: {
        flex: 1,
        padding: 16,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    nextButton: {
        flex: 1.5,
        padding: 16,
        borderRadius: 26,
        alignItems: 'center',
        backgroundColor: '#5C1414',
    },
    disabledButton: {
        opacity: 0.5,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});
