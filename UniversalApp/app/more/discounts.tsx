import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DiscountsScreen() {
    const router = useRouter();

    const discounts = [
        {
            id: 1,
            title: '50% Off Packaging Material',
            description: 'Get flat 50% off on your first order of Riwayat branded packaging materials.',
            validTill: 'Feb 28, 2026',
            code: 'PACK50',
            active: true,
        },
        {
            id: 2,
            title: '50% Off Packaging Material',
            description: 'Get flat 50% off on your first order of Riwayat branded packaging materials.',
            validTill: 'Feb 28, 2026',
            code: 'PACK50',
            active: true,
        },
        {
            id: 3,
            title: '50% Off Packaging Material',
            description: 'Get flat 50% off on your first order of Riwayat branded packaging materials.',
            validTill: 'Feb 28, 2026',
            code: 'PACK50',
            active: true,
        },
        {
            id: 4,
            title: '50% Off Packaging Material',
            description: 'Get flat 50% off on your first order of Riwayat branded packaging materials.',
            validTill: 'Feb 28, 2026',
            code: 'PACK50',
            active: true,
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
                <Text style={styles.headerTitle}>Available discount</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {discounts.map((item) => (
                    <View key={item.id} style={styles.card}>
                        {/* Cutout circles for coupon effect */}
                        <View style={[styles.cutout, styles.cutoutLeft]} />
                        <View style={[styles.cutout, styles.cutoutRight]} />

                        <View style={styles.cardHeader}>
                            <View style={styles.titleRow}>
                                <Ionicons name="pricetag-outline" size={20} color="#E65100" />
                                <Text style={styles.cardTitle}>{item.title}</Text>
                            </View>
                            {item.active && (
                                <View style={styles.activeBadge}>
                                    <Text style={styles.activeText}>Active</Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.cardDesc}>{item.description}</Text>

                        <View style={styles.footer}>
                            <View style={styles.dateRow}>
                                <Ionicons name="time-outline" size={14} color="#666" />
                                <Text style={styles.dateText}>Valid till {item.validTill}</Text>
                            </View>
                            <Pressable style={styles.codeButton}>
                                <Text style={styles.codeText}>{item.code}</Text>
                            </Pressable>
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
        position: 'relative',
        overflow: 'hidden', // Ensure cutouts don't overflow if we place them differently
    },
    cutout: {
        position: 'absolute',
        width: 24,
        height: 24,
        backgroundColor: '#F4FAFF', // Match background
        borderRadius: 12,
        top: '50%',
        marginTop: -12,
    },
    cutoutLeft: {
        left: -12,
    },
    cutoutRight: {
        right: -12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
        flex: 1,
    },
    activeBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeText: {
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        color: '#4CAF50',
    },
    cardDesc: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
        paddingLeft: 28, // Indent to align with text
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 28,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
    },
    codeButton: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    codeText: {
        fontSize: 13,
        fontFamily: 'Poppins_600SemiBold',
        color: '#E65100',
    }
});
