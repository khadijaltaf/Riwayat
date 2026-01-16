
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
    const router = useRouter();
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Navigate to welcome screen after 2.5 seconds
        const timer = setTimeout(() => {
            router.replace('/welcome');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#600E10', '#C42427']}
                style={StyleSheet.absoluteFill}
            />

            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
                {/* Official Logo Image */}
                <Image
                    source={require('../assets/images/app_logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
                <Text style={styles.logoText}>RIWAYAT</Text>
                <Text style={styles.logoTagline}>HERITAGE ON A PLATE, SERVED WITH PRIDE</Text>
                <View style={styles.line} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    logoImage: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    logoWrapper: {
        alignItems: 'center',
    },
    iconWrapper: {
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heartContainer: {
        position: 'absolute',
        top: -5,
        right: -5,
    },
    logoText: {
        fontSize: 42,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
        letterSpacing: 4,
    },
    logoTagline: {
        fontSize: 8,
        color: '#FFFFFF',
        opacity: 0.8,
        letterSpacing: 1,
        marginTop: 4,
        fontFamily: 'Poppins_400Regular',
    },
    line: {
        width: 150,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: 20,
    },
});
