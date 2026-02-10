import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ContactScreen() {
    const router = useRouter();

    const contactOptions = [
        {
            icon: 'chatbubble-ellipses-outline',
            color: '#FF6D00',
            title: 'Chat with Support',
            subtitle: 'Instant help from our support team',
            action: () => { /* Open chat */ }
        },
        {
            icon: 'mail-outline',
            color: '#2979FF',
            title: 'Email Support',
            subtitle: 'Send us your queries at support@riwayat.com',
            action: () => Linking.openURL('mailto:support@riwayat.com')
        },
        {
            icon: 'call-outline',
            color: '#00C853',
            title: 'Call Support',
            subtitle: 'Talk to us directly at 1800-123-4567',
            action: () => Linking.openURL('tel:18001234567')
        }
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#600E10" />
                </Pressable>
                <Text style={styles.headerTitle}>Contact Team Riwayat</Text>
            </View>

            <View style={styles.content}>
                {contactOptions.map((option, index) => (
                    <Pressable key={index} style={styles.card} onPress={option.action}>
                        <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                            <Ionicons name={option.icon as any} size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitle}>{option.title}</Text>
                            <Text style={styles.cardSubtitle} numberOfLines={2}>{option.subtitle}</Text>
                        </View>
                        <Ionicons name="open-outline" size={20} color="#B0B0B0" />
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FAFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    content: {
        padding: 24,
        paddingTop: 10,
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        lineHeight: 18,
    },
});
