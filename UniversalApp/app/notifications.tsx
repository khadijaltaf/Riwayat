
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const NOTIFICATIONS = [
    {
        id: '1',
        title: 'New order received - #1245',
        message: 'Rahul Sharma placed an order',
        time: '2 mins ago',
        icon: 'mail-outline',
        color: '#FF7043',
        isNew: true,
    },
    {
        id: '2',
        title: 'New feedback approved',
        message: 'Customer feedback for "Butter Chicken" is now visible',
        time: '30 mins ago',
        icon: 'chatbubble-outline',
        color: '#4CAF50',
        isNew: true,
    },
    {
        id: '3',
        title: 'Payout completed',
        message: '₹12,450 transferred to your account',
        time: '1 hour ago',
        icon: 'logo-usd',
        color: '#4CAF50',
        isNew: true,
    },
    {
        id: '4',
        title: 'New feedback received',
        message: 'Pending admin approval for "Chicken Biryani"',
        time: '2 hours ago',
        icon: 'chatbox-outline',
        color: '#FFA726',
        isNew: false,
    },
    {
        id: '5',
        title: 'New campaign available',
        message: 'Weekend Special - Get 20% extra orders',
        time: '3 hours ago',
        icon: 'gift-outline',
        color: '#AB47BC',
        isNew: false,
    },
    {
        id: '6',
        title: 'Order completed - #1240',
        message: 'Customer rated 5 stars',
        time: '5 hours ago',
        icon: 'cube-outline',
        color: '#FF7043',
        isNew: false,
    },
    {
        id: '7',
        title: 'Feedback review update',
        message: 'Admin has reviewed feedback - check admin note',
        time: '1 day ago',
        icon: 'chatbubble-ellipses-outline',
        color: '#EF5350',
        isNew: false,
    },
];

export default function NotificationsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#600E10" />
                </Pressable>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {NOTIFICATIONS.map((item) => (
                    <View key={item.id} style={styles.notificationCard}>
                        <View style={[styles.iconWrapper, { backgroundColor: item.color + '15' }]}>
                            <Ionicons name={item.icon as any} size={22} color={item.color} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.message}>{item.message}</Text>
                            <Text style={styles.time}>{item.time}</Text>
                        </View>
                        {item.isNew && <View style={styles.dot} />}
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
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 24,
        backgroundColor: '#F4FAFF',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    content: {
        padding: 24,
        paddingTop: 10,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        position: 'relative',
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    message: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginBottom: 6,
    },
    time: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#B0B0B0',
    },
    dot: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5252',
    },
});
