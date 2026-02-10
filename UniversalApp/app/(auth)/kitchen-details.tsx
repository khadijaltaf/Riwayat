import { api } from '@/lib/api-client';
import { localStorageService } from '@/services/local-storage-service';
import { storageService } from '@/services/storage-service';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function KitchenDetailsScreen() {
    const [kitchenName, setKitchenName] = useState('');
    const [tagline, setTagline] = useState('');
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [showTaglineInfo, setShowTaglineInfo] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        const progress = await localStorageService.getOnboardingProgress();
        if (progress?.kitchen_name) setKitchenName(progress.kitchen_name);
        if (progress?.kitchen_tagline) setTagline(progress.kitchen_tagline);
        if (progress?.kitchen_banner_url) setBannerImage(progress.kitchen_banner_url);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setBannerImage(result.assets[0].uri);
        }
    };

    const handleContinue = async () => {
        Keyboard.dismiss();
        if (!kitchenName) return Alert.alert('Error', 'Please enter your kitchen name');

        // Save to Supabase
        setLoading(true);
        try {
            let bannerUrl = '';
            if (bannerImage && bannerImage.startsWith('file://')) {
                const { publicUrl, error: uploadError } = await storageService.uploadFile(bannerImage, 'kitchen-media');
                if (uploadError) {
                    console.warn('Banner upload error (continuing):', uploadError);
                } else {
                    bannerUrl = publicUrl || '';
                }
            }

            // Save to Local Storage & Supabase
            await localStorageService.saveOnboardingProgress({
                phone,
                kitchen_name: kitchenName,
                kitchen_tagline: tagline,
                kitchen_banner_url: bannerUrl || bannerImage || null,
                step: 'location'
            });

            const { error } = await api.onboarding.updateSession({
                phone,
                kitchen_name: kitchenName,
                kitchen_tagline: tagline,
                kitchen_description: tagline,
                kitchen_banner_url: bannerUrl || bannerImage || null,
                step: 'location',
                updated_at: new Date().toISOString()
            });

            if (error) console.warn('API save error:', error);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
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
                    <Text style={styles.stepText}>2/6</Text>
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kitchen Banner Image</Text>
                        <Pressable style={styles.uploadBox} onPress={pickImage}>
                            {bannerImage ? (
                                <Image source={{ uri: bannerImage }} style={styles.uploadedImage} />
                            ) : (
                                <>
                                    <Ionicons name="image-outline" size={32} color="#600E10" />
                                    <Text style={styles.uploadText}>Upload banner photo</Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, (!kitchenName || loading) && styles.disabledButton]}
                        onPress={handleContinue}
                        disabled={!kitchenName || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.nextButtonText}>Continue</Text>
                        )}
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
    uploadBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        height: 150,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    uploadText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginTop: 8,
    },
});
