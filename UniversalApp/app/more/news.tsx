import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function NewsScreen() {
    const router = useRouter();

    const newsItems = [
        {
            id: 1,
            title: 'New Feature: Monthly Payout Reports',
            description: 'You can now view detailed monthly payout reports directly in the app. Check your earnings tab for more.',
            date: 'Jan 15, 2026',
        },
        {
            id: 2,
            title: 'Holiday Season Surge Pricing',
            description: 'Earn more during the upcoming holiday season with our dynamic surge pricing model.',
            date: 'Jan 10, 2026',
        },
        {
            id: 3,
            title: 'Update to Packaging Guidelines',
            description: 'We have updated our packaging guidelines to ensure better food safety and customer satisfaction.',
            date: 'Jan 05, 2026',
        },
        {
            id: 4,
            title: 'Update to Packaging Guidelines',
            description: 'We have updated our packaging guidelines to ensure better food safety and customer satisfaction.',
            date: 'Jan 05, 2026',
        },
        {
            id: 5,
            title: 'Update to Packaging Guidelines',
            description: 'We have updated our packaging guidelines to ensure better food safety and customer satisfaction.',
            date: 'Jan 05, 2026',
        },
        {
            id: 6,
            title: 'Update to Packaging Guidelines',
            description: 'We have updated our packaging guidelines to ensure better food safety and customer satisfaction.',
            date: 'Jan 05, 2026',
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#600E10" />
                </Pressable>
                <Text style={styles.headerTitle}>News & Updates</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {newsItems.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Ionicons name="chevron-forward" size={16} color="#999" />
                        </View>
                        <Text style={styles.cardDesc}>{item.description}</Text>
                        <View style={styles.dateRow}>
                            <Ionicons name="calendar-outline" size={14} color="#999" />
                            <Text style={styles.dateText}>{item.date}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
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
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    content: {
        padding: 24,
        paddingTop: 10,
        gap: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 0,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold', // Bold title
        color: '#1A1A1A',
        flex: 1,
        paddingRight: 10,
    },
    cardDesc: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        lineHeight: 22,
        marginBottom: 16,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#999',
    },
});
