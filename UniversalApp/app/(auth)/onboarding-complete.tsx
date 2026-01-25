
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingCompleteScreen() {
    const router = useRouter();
    const scaleAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleDone = () => {
        // Use replace to clear onboarding stack
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.successIconWrapper}>
                        <View style={styles.checkCircle}>
                            <Ionicons name="checkmark" size={60} color="#2E7D32" />
                        </View>
                    </View>

                    <Text style={styles.title}>Request Submitted!</Text>
                    <Text style={styles.subtitle}>
                        Your application for Kitchen Registration has been received.
                    </Text>

                    <View style={styles.tipSection}>
                        <View style={styles.tipBox}>
                            <View style={styles.tipHeader}>
                                <Ionicons name="help-circle-outline" size={24} color="#E8906C" />
                                <Text style={styles.tipTitle}>Need Help?</Text>
                            </View>
                            <Text style={styles.tipText}>
                                Our support team will reach out to you within 24-48 hours. If you have any urgent queries, contact us at <Text style={styles.boldText}>support@riwayat.com</Text>
                            </Text>
                        </View>

                        <View style={styles.tipBox}>
                            <View style={styles.tipHeader}>
                                <Ionicons name="time-outline" size={24} color="#E8906C" />
                                <Text style={styles.tipTitle}>What happens next?</Text>
                            </View>
                            <Text style={styles.tipText}>
                                Once your profile is reviewed, you'll receive a confirmation and we'll help you set up your first menu.
                            </Text>
                        </View>
                    </View>

                    <Pressable style={styles.doneButton} onPress={handleDone}>
                        <Text style={styles.doneButtonText}>Go to Dashboard</Text>
                    </Pressable>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FAFF',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        alignItems: 'center',
    },
    successIconWrapper: {
        marginBottom: 30,
    },
    checkCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFFFFF',
        borderWidth: 8,
        borderColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        color: '#4A4A4A',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 26,
    },
    tipSection: {
        width: '100%',
        gap: 20,
        marginBottom: 40,
    },
    tipBox: {
        backgroundColor: '#FFEFE6',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E8906C',
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    tipTitle: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#E8906C',
    },
    tipText: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#4A4A4A',
        lineHeight: 22,
    },
    boldText: {
        fontFamily: 'Poppins_700Bold',
    },
    doneButton: {
        width: '100%',
        backgroundColor: '#600E10',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    doneButtonText: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
});
