
import { api } from '@/lib/api-client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const { width } = Dimensions.get('window');




export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState('All');
    const [ownerName, setOwnerName] = useState('Partner');
    const [kitchenName, setKitchenName] = useState('My Kitchen');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const tabs = ['All', 'New', 'Canceled', 'Pending'];

    React.useEffect(() => {
        fetchProfile();
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.orders.list();
            if (data) setOrders(data);
        } catch (e) {
            console.warn('Error fetching orders:', e);
        }
    };

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await api.auth.getUser();
            if (user) {
                const { data: profile } = await api.profile.get(user.id);
                if (profile?.owner_name) setOwnerName(profile.owner_name);

                const { data: kitchen } = await api.kitchen.get(user.id);
                if (kitchen?.name) setKitchenName(kitchen.name);
            }
        } catch (e) {
            console.warn('Error fetching profile in Orders', e);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New':
            case 'PENDING': return '#5C1414';
            case 'Canceled':
            case 'CANCELLED': return '#D32F2F';
            case 'Pending':
            case 'ACCEPTED':
            case 'PREPARING': return '#D48806';
            case 'READY':
            case 'COMPLETED': return '#2E7D32';
            default: return '#5C1414';
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greetingText}>Hello, {ownerName}</Text>
                        <Text style={styles.kitchenNameText}>{kitchenName}</Text>
                    </View>
                    <Pressable style={styles.notificationButton}>
                        <Ionicons name="notifications" size={24} color="#FF8A65" />
                    </Pressable>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#B0B0B0" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Orders"
                        placeholderTextColor="#B0B0B0"
                    />
                </View>

                {/* Metric Cards */}
                <View style={styles.metricRow}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>5</Text>
                        <Text style={styles.metricLabel}>Active</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>6</Text>
                        <Text style={styles.metricLabel}>Today Orders</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>$100</Text>
                        <Text style={styles.metricLabel}>Revenue</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabScrollContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
                        {tabs.map((tab) => (
                            <Pressable
                                key={tab}
                                style={[styles.tab, activeTab === tab && styles.activeTab]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Order List */}
                <View style={styles.orderList}>
                    {orders.filter(o => activeTab === 'All' || o.status === activeTab.toUpperCase() || o.status === activeTab).map((order, idx) => (
                        <View key={`${order.id}-${idx}`} style={styles.orderCard}>
                            <View style={styles.orderCardHeader}>
                                <Text style={styles.orderId}>{order.id}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) } as any]}>
                                    <Text style={styles.statusText}>{order.status}</Text>
                                </View>
                            </View>
                            <Text style={styles.customerName}>{order.customer_name || order.customer}</Text>

                            <View style={styles.orderDetailsRow}>
                                <Text style={styles.orderSummary}>{order.items?.length || '3'} items • {order.location || 'Sarabha Nagar'}</Text>
                                <Text style={styles.orderPrice}>${order.total || order.price}</Text>
                            </View>

                            <Text style={styles.orderTime}>{order.time || '2 mins ago'}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FBFF',
    },
    content: {
        padding: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greetingText: {
        fontSize: 24,
        color: '#000000',
        fontFamily: 'Poppins_400Regular',
    },
    kitchenNameText: {
        fontSize: 28,
        fontFamily: 'Poppins_700Bold',
        color: '#000000',
        marginTop: -5,
    },
    notificationButton: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 20,
        height: 54,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#000',
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 35,
        gap: 12,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    metricValue: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#000000',
    },
    metricLabel: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: '#E8906C',
        marginTop: 2,
        textAlign: 'center',
    },
    tabScrollContainer: {
        marginBottom: 25,
    },
    tabsRow: {
        gap: 15,
        paddingRight: 20,
    },
    tab: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: '#5C1414',
    },
    tabText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#7C7C7C',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    orderList: {
        gap: 20,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.06,
        shadowRadius: 15,
        elevation: 4,
    },
    orderCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#000000',
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    customerName: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#7C7C7C',
        marginBottom: 15,
    },
    orderDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderSummary: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
    },
    orderPrice: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#000000',
    },
    orderTime: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: '#B0B0B0',
    }
});

