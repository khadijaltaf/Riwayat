
import React from 'react';
import { StyleSheet, View, Text, Pressable, Image, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#600E10', '#C42427']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.content}>
                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <Image
                        source={require('../assets/images/app_logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.logoText}>RIWAYAT</Text>
                    <Text style={styles.logoSubtext}>HERITAGE ON A PLATE, SERVED WITH PRIDE</Text>
                </View>
                <View style={styles.divider} />

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Riwayat brings you the warm, homemade taste that feels straight from the heart.
                </Text>

                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('../assets/images/welcome_chef.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={styles.loginButton}
                        onPress={() => router.push('/(auth)/login' as any)}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </Pressable>

                    <Pressable
                        style={styles.signupButton}
                        onPress={() => router.push('/(auth)/register' as any)}
                    >
                        <Text style={styles.signupButtonText}>Sign up as a home chef</Text>
                    </Pressable>
                </View>

                {/* Contact Us */}
                <Pressable style={styles.contactUs}>
                    <Ionicons name="call" size={20} color="#FFFFFF" />
                    <Text style={styles.contactText}>Contact Us</Text>
                    <View style={styles.underline} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 30,
        alignItems: 'center',
        paddingTop: 80,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoIcon: {
        marginBottom: 10,
    },
    logoImage: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    heartContainer: {
        position: 'absolute',
        top: -4,
        right: -4,
    },
    logoText: {
        fontSize: 32,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    logoSubtext: {
        fontSize: 8,
        color: '#FFFFFF',
        opacity: 0.8,
        letterSpacing: 1,
        marginTop: 4,
        fontFamily: 'Poppins_400Regular',
    },
    divider: {
        width: width * 0.8,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: 25,
    },
    subtitle: {
        fontSize: 15,
        color: '#FFFFFF',
        textAlign: 'left',
        lineHeight: 24,
        marginVertical: 30,
        width: '100%',
        paddingHorizontal: 5,
        fontFamily: 'Poppins_400Regular',
    },
    illustrationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
    },
    illustration: {
        width: width * 0.7,
        height: width * 0.7,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: '#400202',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
    signupButton: {
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
        backgroundColor: '#A81C1C',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
    contactUs: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    contactText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
    underline: {
        position: 'absolute',
        bottom: -2,
        left: 30,
        right: 0,
        height: 1,
        backgroundColor: '#FFFFFF',
    },
});
