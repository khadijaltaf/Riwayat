import { api } from '@/lib/api-client';
import { localStorageService } from '@/services/local-storage-service';
import { storageService } from '@/services/storage-service';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function IDVerificationScreen() {
    const [cnic, setCnic] = useState('');
    const [ntn, setNtn] = useState('');
    const [hasFoodLicense, setHasFoodLicense] = useState<boolean | null>(null);
    const [cnicImage, setCnicImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const router = useRouter();

    React.useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        const progress = await localStorageService.getOnboardingProgress();
        if (progress?.cnic_number) setCnic(progress.cnic_number);
        if (progress?.ntn_number) setNtn(progress.ntn_number);
        if (progress?.has_food_license !== undefined) setHasFoodLicense(progress.has_food_license);
        if (progress?.cnic_image_url) setCnicImage(progress.cnic_image_url);
    };

    const pickImage = async () => {
        Keyboard.dismiss();
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setCnicImage(result.assets[0].uri);
        }
    };

    const formatCNIC = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        let formatted = cleaned;
        if (cleaned.length > 5) {
            formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
        }
        if (cleaned.length > 12) {
            formatted = `${formatted.slice(0, 13)}-${cleaned.slice(12, 13)}`;
        }
        return formatted;
    };

    const handleCnicChange = (text: string) => {
        const formatted = formatCNIC(text);
        if (formatted.replace(/\D/g, '').length <= 13) {
            setCnic(formatted);
        }
    };

    const handleContinue = async () => {
        Keyboard.dismiss();
        setLoading(true);

        try {
            let cnicUrl = '';

            // 1. Upload Image to Supabase Storage (Non-blocking)
            if (cnicImage && cnicImage.startsWith('file://')) {
                try {
                    const { publicUrl, error: uploadError } = await storageService.uploadFile(cnicImage, 'kitchen-media');
                    if (uploadError) {
                        console.warn('Storage upload error (continuing):', uploadError);
                    } else {
                        cnicUrl = publicUrl || '';
                    }
                } catch (err) {
                    console.warn('Storage exception (continuing):', err);
                }
            }

            // 2. Save Data to Local Storage & API
            await localStorageService.saveOnboardingProgress({
                phone,
                cnic_number: cnic || null,
                cnic_image_url: cnicUrl || cnicImage || null,
                ntn_number: ntn || null,
                has_food_license: hasFoodLicense,
                step: 'review_summary'
            });

            const { error } = await api.onboarding.updateSession({
                phone,
                cnic_number: cnic || null,
                cnic_image_url: cnicUrl || cnicImage || null,
                ntn_number: ntn || null,
                has_food_license: hasFoodLicense,
                step: 'review_summary',
                updated_at: new Date().toISOString()
            });

            if (error) {
                console.warn('Database update error (continuing):', error);
            }

            // Navigate to Screen 12: Review Summary
            router.push({ pathname: '/(auth)/review-summary', params: { phone } });
        } catch (e: any) {
            console.error('Onboarding continue error:', e);
            // Absolute fallback: always allow proceeding
            router.push({ pathname: '/(auth)/review-summary', params: { phone } });
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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.stepText}>5/6</Text>
                    <View style={styles.iconContainer}>
                        <Ionicons name="card" size={24} color="#600E10" />
                    </View>
                </View>

                {/* Title and Subtitle */}
                <Text style={styles.title}>ID Verification</Text>
                <Text style={styles.subtitle}>
                    Provide your CNIC for secure registration.
                </Text>

                {/* Form Fields */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Choose Document Type</Text>
                        <Pressable style={styles.dropdown}>
                            <Text style={styles.dropdownText}>CNIC</Text>
                            <Ionicons name="chevron-down" size={20} color="#1A1A1A" />
                        </Pressable>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CNIC Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="35202-0000000-0"
                            value={cnic}
                            onChangeText={handleCnicChange}
                            keyboardType="number-pad"
                            maxLength={15}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.uploadSection}>
                        <Text style={styles.label}>Upload CNIC</Text>
                        <Pressable style={styles.uploadBox} onPress={pickImage}>
                            {cnicImage ? (
                                <Image source={{ uri: cnicImage }} style={styles.uploadedImage} />
                            ) : (
                                <>
                                    <View style={styles.uploadIconCircle}>
                                        <Ionicons name="cloud-upload-outline" size={30} color="#600E10" />
                                    </View>
                                    <Text style={styles.uploadTip}>Upload clear photo of your CNIC</Text>
                                </>
                            )}
                        </Pressable>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>NTN Number (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter NTN"
                            value={ntn}
                            onChangeText={setNtn}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Do u have food license?</Text>
                        <View style={styles.radioRow}>
                            <Pressable style={styles.radioButton} onPress={() => setHasFoodLicense(true)}>
                                <View style={[styles.radioCircle, hasFoodLicense === true && styles.radioSelected]}>
                                    {hasFoodLicense === true && <View style={styles.radioInner} />}
                                </View>
                                <Text style={styles.radioLabel}>YES</Text>
                            </Pressable>
                            <Pressable style={styles.radioButton} onPress={() => setHasFoodLicense(false)}>
                                <View style={[styles.radioCircle, hasFoodLicense === false && styles.radioSelected]}>
                                    {hasFoodLicense === false && <View style={styles.radioInner} />}
                                </View>
                                <Text style={styles.radioLabel}>NO</Text>
                            </Pressable>
                        </View>
                    </View>

                    <Pressable style={styles.checkboxRow}>
                        <View style={styles.checkbox}>
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        </View>
                        <Text style={styles.checkboxLabel}>I confirm the information is true, and I agree to Riwayat terms & conditions.</Text>
                    </Pressable>
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, loading && styles.disabledButton]}
                        onPress={handleContinue}
                        disabled={loading}
                    >
                        <Text style={styles.nextButtonText}>
                            {loading ? 'Processing...' : 'Continue'}
                        </Text>
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
        marginBottom: 30,
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
    uploadSection: {
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    dropdownText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
    },
    placeholderText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#999',
    },
    uploadBox: {
        height: 120,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F4FAFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    uploadTip: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#999',
    },
    radioRow: {
        flexDirection: 'row',
        gap: 30,
        marginTop: 5,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#600E10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: '#E8906C',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E8906C',
    },
    radioLabel: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: '#E8906C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#600E10',
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 'auto',
        paddingVertical: 20,
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
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        resizeMode: 'cover',
    },
});
