
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

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
        route: '/kitchen/feedback',
        color: '#FFECDA',
        iconColor: '#D84315'
    },
    {
        id: 'request',
        title: 'Kitchen Request',
        icon: 'document-text-outline',
        route: '/kitchen/request',
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

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' }}
                        style={styles.avatar}
                    />
                    <View style={styles.welcomeTextContainer}>
                        <Text style={styles.greeting}>Hello,</Text>
                        <Text style={styles.kitchenName}>Ananya's Kitchen</Text>
                    </View>
                </View>
                <Pressable style={styles.notificationBtn}>
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
