import { api } from '@/lib/api-client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function MoreScreen() {
    const router = useRouter();
    const [kitchenName, setKitchenName] = useState('My Kitchen');
    const [ownerName, setOwnerName] = useState('Partner');
    const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await api.auth.getUser();
            if (user) {
                const { data: profile } = await api.profile.get(user.id);
                if (profile?.owner_name) setOwnerName(profile.owner_name);
                if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);

                const { data: kitchen } = await api.kitchen.get(user.id);
                if (kitchen?.name) setKitchenName(kitchen.name);
            }
        } catch (e) {
            console.warn('Error fetching profile in More', e);
        }
    };

    const menuItems = [
        { icon: 'newspaper-outline', label: 'News & Updates', route: '/more/news', color: '#FF8A65' },
        { icon: 'pricetag-outline', label: 'Available discount', route: '/more/discounts', color: '#FF8A65' },
        { icon: 'chatbubbles-outline', label: 'Contact Team Riwayat', route: '/more/contact', color: '#FF8A65' },
        { icon: 'alert-circle-outline', label: 'Raised a complaint', route: '/more/complaint', color: '#FF8A65' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.profileRow}>
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    <View style={styles.headerText}>
                        <Text style={styles.greeting}>Hello,</Text>
                        <Text style={styles.kitchenName}>{kitchenName}</Text>
                    </View>
                </View>
                <Pressable style={styles.notificationButton}>
                    <Ionicons name="notifications" size={24} color="#FF5252" />
                </Pressable>
            </View>

            {/* Menu List */}
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <Pressable
                        key={index}
                        style={styles.menuItem}
                        onPress={() => router.push(item.route as any)}
                    >
                        <View style={styles.iconCircle}>
                            <Ionicons name={item.icon as any} size={22} color={item.color} />
                        </View>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 30,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    headerText: {
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
    },
    kitchenName: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
        marginTop: -2,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    menuContainer: {
        paddingHorizontal: 24,
        gap: 16,
    },
    menuItem: {
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
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF3E0', // Light orange bg for icons
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: '#1A1A1A',
    },
});
