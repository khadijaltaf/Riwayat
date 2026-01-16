
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const SETTINGS_OPTIONS = [
    { id: '1', title: 'Kitchen Profile', icon: 'restaurant-outline', description: 'Update your kitchen info' },
    { id: '2', title: 'Owner Details', icon: 'person-outline', description: 'Manage owner information' },
    { id: '3', title: 'Location Settings', icon: 'location-outline', description: 'Update your kitchen address' },
    { id: '4', title: 'Menu Categories', icon: 'grid-outline', description: 'Manage food categories' },
    { id: '5', title: 'ID Verification', icon: 'shield-checkmark-outline', description: 'Identity and license docs' },
    { id: '6', title: 'Operational Hours', icon: 'time-outline', description: 'When are you open?' },
];

export default function KitchenSettingsScreen() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <StatusBar style="dark" />

            <Text style={styles.title}>Kitchen Management</Text>

            <View style={styles.grid}>
                {SETTINGS_OPTIONS.map((item) => (
                    <Pressable
                        key={item.id}
                        style={styles.card}
                        onPress={() => {
                            if (item.id === '1') router.push('/kitchen/details');
                            if (item.id === '3') router.push('/kitchen/location');
                            if (item.id === '6') router.push('/kitchen/availability');
                            // We will add more as we implement
                        }}
                    >
                        <View style={styles.iconWrapper}>
                            <Ionicons name={item.icon as any} size={28} color="#5C1414" />
                        </View>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardDesc}>{item.description}</Text>
                    </Pressable>
                ))}

                {/* Adding Kitchen Media */}
                <Pressable
                    style={styles.card}
                    onPress={() => router.push('/kitchen/media')}
                >
                    <View style={styles.iconWrapper}>
                        <Ionicons name="images-outline" size={28} color="#5C1414" />
                    </View>
                    <Text style={styles.cardTitle}>Kitchen Media</Text>
                    <Text style={styles.cardDesc}>Upload logo, banners, and food pictures</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FAFF',
    },
    content: {
        padding: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    card: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#FFEFE6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 11,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        lineHeight: 16,
    },
});
