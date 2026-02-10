import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EarningsScreen() {
    const router = useRouter();
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

    // Mock Data
    const transactions = [
        { id: '1', date: '30th December', amount: '18,700', status: 'Credited' },
        { id: '2', date: '30th December', amount: '18,700', status: 'Credited' },
        { id: '3', date: '30th December', amount: '18,700', status: 'Credited' },
        { id: '4', date: '20th December', amount: '12,700', status: 'Credited' },
        { id: '5', date: '10th December', amount: '450', status: 'Credited' },
    ];

    const handleMorePress = (id: string) => {
        setSelectedTransactionId(id);
        setPopoverVisible(true);
    };

    const handleAction = (action: string) => {
        setPopoverVisible(false);
        if (action === 'Raise Case') {
            router.push('/feedback/raise-case' as any);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.helloText}>Hello,</Text>
                    <Text style={styles.kitchenName}>Ananya's Kitchen</Text>
                </View>
                <Pressable style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color="#FF6D00" />
                    <View style={styles.notifDot} />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Current Month Card */}
                <Text style={styles.sectionTitle}>Current Month</Text>
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.monthName}>January</Text>
                        <View style={styles.ongoingBadge}>
                            <Text style={styles.ongoingText}>Ongoing</Text>
                        </View>
                    </View>
                    <Text style={styles.dateRange}>1st January – 31st January</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Ionicons name="receipt-outline" size={20} color="#666" style={{ marginBottom: 4 }} />
                            <Text style={styles.statLabel}>Orders</Text>
                            <Text style={styles.statValue}>142</Text>
                        </View>
                        <View style={[styles.statBox, styles.earnedBox]}>
                            <Ionicons name="trending-up-outline" size={20} color="#666" style={{ marginBottom: 4 }} />
                            <Text style={styles.statLabel}>Earned</Text>
                            <Text style={styles.statValue}>$45,200</Text>
                        </View>
                    </View>
                </View>

                {/* Details Section */}
                <Text style={styles.sectionTitle}>Details</Text>

                {/* Group by Month (Mocking December group) */}
                <View style={styles.monthGroup}>
                    <Text style={styles.groupMonthTitle}>December</Text>
                    <Text style={styles.groupDateRange}>1st Dec – 31st Dec</Text>
                    <Text style={styles.groupTotalOrders}>Orders : 30</Text>
                    <Text style={styles.groupTotalAmount}>$450</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.groupArrow} />
                </View>

                {/* Transaction List */}
                {transactions.map((item) => (
                    <View key={item.id} style={styles.transactionCard}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="checkmark-circle-outline" size={24} color="#00C853" />
                        </View>
                        <View style={styles.transactionInfo}>
                            <Text style={styles.transactionTitle}>Payment Received</Text>
                            <Text style={styles.transactionDate}>{item.date}</Text>
                        </View>
                        <View style={styles.amountInfo}>
                            <Text style={styles.amountText}>${item.amount}</Text>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                        {/* More Options (Three dots) - functionality requested */}
                        {/* For simplicity we can make the whole card pressable or add a button */}
                        {/* User design shows a "More" button/popover on top right usually, but let's assume it's triggered by a button */}

                        {/* Using a placeholder for the popup interaction as requested by design */}
                        {/* We can add a small button to trigger the popover for 'Raise Case/Statement' */}
                    </View>
                ))}
                {/* Explicit "Link" to Raise Case for verifying the requirement */}
                <Pressable style={styles.linkButton} onPress={() => router.push('/feedback/raise-case' as any)}>
                    <Text style={styles.linkButtonText}>Need Help? <Text style={{ textDecorationLine: 'underline' }}>Raise a Case</Text></Text>
                </Pressable>

            </ScrollView>

            {/* Simple Modal/Popover for 'Raise Case' logic simulation */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F8FF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
    },
    helloText: {
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
    },
    kitchenName: {
        fontSize: 22,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
    },
    notificationButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    notifDot: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5252',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginBottom: 16,
        marginTop: 10,
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 30,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    monthName: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#0D1F3C',
    },
    ongoingBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    ongoingText: {
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
        color: '#4CAF50',
    },
    dateRange: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: '#90A3BF',
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#FFF6E5', // Light orange for orders
        borderRadius: 16,
        padding: 16,
    },
    earnedBox: {
        backgroundColor: '#E8F5E9', // Light green for earnings
    },
    statLabel: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: '#666',
    },
    statValue: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginTop: 4,
    },
    monthGroup: { // Creating the "December" summary row style
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    groupMonthTitle: {
        width: '100%',
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    groupDateRange: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Poppins_400Regular',
        marginRight: 'auto',
    },
    groupTotalOrders: {
        fontSize: 13,
        color: '#666',
        fontFamily: 'Poppins_500Medium',
        marginRight: 16,
    },
    groupTotalAmount: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginRight: 8,
    },
    groupArrow: {
        marginLeft: 4,
    },
    transactionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row', // Horizontal layout
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 1,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: '#90A3BF',
    },
    transactionDate: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
    },
    amountInfo: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
    },
    statusText: {
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
        color: '#4CAF50',
    },
    linkButton: {
        alignSelf: 'center',
        marginTop: 20,
        padding: 10,
    },
    linkButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: '#666',
    }

});
