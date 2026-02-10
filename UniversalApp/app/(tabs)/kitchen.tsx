import { api } from '@/lib/api-client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const KITCHEN_MENU_ITEMS = [
    {
        id: 'chat',
        title: 'Kitchen Chat',
        icon: 'chatbubble-ellipses-outline',
        route: '/chat',
        color: '#FFECDA',
        iconColor: '#D84315'
    },
    {
        id: 'discount',
        title: 'Discount',
        icon: 'pricetag-outline',
        route: '/kitchen/discount',
        color: '#FFECDA',
        iconColor: '#D84315'
    },
    {
        id: 'feedback',
        title: 'Feedback',
        icon: 'star-outline',
        route: '/feedback',
        color: '#FFECDA',
        iconColor: '#D84315'
    },
    {
        id: 'request',
        title: 'Kitchen Request',
        icon: 'document-text-outline',
        route: '/kitchen/details',
        color: '#FFECDA',
        iconColor: '#D84315'
    },
    {
        id: 'availability',
        title: 'Kitchen Availability',
        icon: 'time-outline',
        route: '/kitchen/availability',
        color: '#FFECDA',
        iconColor: '#D84315'
    },
    {
        id: 'media',
        title: 'Kitchen Media',
        icon: 'images-outline',
        route: '/kitchen/media',
        color: '#FFECDA',
        iconColor: '#D84315'
    },
    {
        id: 'address',
        title: 'Kitchen Address',
        icon: 'location-outline',
        route: '/kitchen/location',
        color: '#FFECDA',
        iconColor: '#D84315'
    },
    {
        id: 'story',
        title: 'Kitchen Chef Story',
        icon: 'book-outline',
        route: '/kitchen/story',
        color: '#FFECDA',
        iconColor: '#D84315'
    },
];

export default function KitchenScreen() {
    const router = useRouter();
    const [ownerName, setOwnerName] = useState('Partner');
    const [kitchenName, setKitchenName] = useState('My Kitchen');
    const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80');

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
            console.warn('Error fetching profile in Kitchen tab', e);
        }
    };

    const handleLogout = async () => {
        try {
            await api.auth.signOut();
            router.replace('/(auth)/login');
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Image
                        source={{ uri: avatarUrl }}
                        style={styles.avatar}
                    />
                    <View style={styles.welcomeTextContainer}>
                        <Text style={styles.greeting}>Hello, {ownerName || 'Partner'}</Text>
                        <Text style={styles.kitchenName}>{kitchenName}</Text>
                    </View>
                </View>
                <Pressable style={styles.notificationBtn} onPress={() => router.push('/notifications' as any)}>
                    <Ionicons name="notifications" size={24} color="#D84315" />
                    <View style={styles.notificationDot} />
                </Pressable>
            </View>

            {/* Menu List */}
            <View style={styles.listContainer}>
                {KITCHEN_MENU_ITEMS.map((item) => (
                    <Pressable
                        key={item.id}
                        style={styles.listItem}
                        onPress={() => router.push(item.route as any)}
                    >
                        <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                            <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
                        </View>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" style={styles.arrow} />
                    </Pressable>
                ))}

                {/* Logout Button */}
                <Pressable
                    style={[styles.listItem, styles.logoutItem]}
                    onPress={handleLogout}
                >
                    <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                        <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
                    </View>
                    <Text style={[styles.itemTitle, { color: '#D32F2F' }]}>Logout</Text>
                </Pressable>
            </View>
            <View style={{ height: 80 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FC',
    },
    logoutItem: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#FFEBEE',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    welcomeTextContainer: {
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
        lineHeight: 20,
    },
    kitchenName: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
        lineHeight: 22,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5722',
        borderWidth: 1,
        borderColor: '#FFF',
    },
    listContainer: {
        marginTop: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginBottom: 15,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
        height: 70,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    itemTitle: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: '#1A1A1A',
    },
    arrow: {
        opacity: 0.5,
    },
});
