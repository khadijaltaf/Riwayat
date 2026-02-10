import { api } from '@/lib/api-client';
import { localStorageService } from '@/services/local-storage-service';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LocationScreen() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [area, setArea] = useState('');
    const [mapLink, setMapLink] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    React.useEffect(() => {
        fetchLocationData();
    }, []);

    const fetchLocationData = async () => {
        try {
            // Priority 1: Local Storage
            const progress = await localStorageService.getOnboardingProgress();
            if (progress?.address) setAddress(progress.address);
            if (progress?.city) setCity(progress.city);
            if (progress?.area) setArea(progress.area);
            if (progress?.map_link) setMapLink(progress.map_link);

            // Priority 2: API (if local is empty or for syncing)
            if (!progress?.address) {
                const { data: session } = await api.onboarding.getSession(phone);
                if (session) {
                    if (session.address) setAddress(session.address);
                    if (session.city) setCity(session.city);
                    if (session.area) setArea(session.area);
                    if (session.map_link) setMapLink(session.map_link);
                }
            }
        } catch (e) {
            console.warn('Error fetching location data', e);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenMaps = () => {
        // Open Google Maps to let user find their location
        const url = 'https://www.google.com/maps';
        import('react-native').then(({ Linking }) => {
            Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open Maps app'));
        });
    };

    const handleContinue = async () => {
        Keyboard.dismiss();
        if (!address || !city) return Alert.alert('Error', 'Please enter your address and city');

        // Save to Local Storage & API
        setLoading(true);
        try {
            await localStorageService.saveOnboardingProgress({
                phone,
                address: address,
                city: city,
                area: area,
                map_link: mapLink,
                step: 'categories'
            });

            const { error } = await api.onboarding.updateSession({
                phone,
                address: address,
                city: city,
                area: area,
                map_link: mapLink,
                step: 'categories',
                updated_at: new Date().toISOString()
            });

            if (error) console.warn('API save error:', error);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }

        // Navigate to Screen: Categories
        router.push({ pathname: '/(auth)/categories', params: { phone } });
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
                    <Text style={styles.stepText}>3/6</Text>
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
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Google Map Location Link</Text>
                            <Pressable style={styles.openMapsBtn} onPress={handleOpenMaps}>
                                <Ionicons name="map-outline" size={16} color="#600E10" />
                                <Text style={styles.openMapsText}>Open Maps</Text>
                            </Pressable>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Paste Google Maps link here"
                            value={mapLink}
                            onChangeText={setMapLink}
                            placeholderTextColor="#999"
                        />
                        <Text style={styles.helperText}>Open Maps, drop a pin, share and copy the link here.</Text>
                    </View>

                    <View style={styles.mapPreviewSection}>
                        <Text style={styles.label}>Map Location Status</Text>
                        <View style={[styles.mapBox, mapLink ? styles.mapBoxActive : null]}>
                            <View style={styles.mapIconCircle}>
                                <Ionicons name="location" size={30} color={mapLink ? "#2E7D32" : "#600E10"} />
                            </View>
                            <Text style={mapLink ? styles.mapSuccess : styles.mapTip}>
                                {mapLink ? 'Location Linked successfully' : 'Add Google Maps link to verify location'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, (!address || !city || loading) && styles.disabledButton]}
                        onPress={handleContinue}
                        disabled={!address || !city || loading}
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
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    openMapsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#FFEFE6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E8906C',
    },
    openMapsText: {
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    helperText: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginTop: 6,
    },
    mapBoxActive: {
        borderColor: '#2E7D32',
        backgroundColor: '#E8F5E9',
    },
    mapSuccess: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#2E7D32',
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
