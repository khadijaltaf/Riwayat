
import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Mock Data
const USERS = [
    { id: '1', name: 'Rajesh Kumar', role: 'OWNER', email: 'rajesh@email.com', phone: '+91 98765 43210', status: 'Active' },
    { id: '2', name: 'Priya Sharma', role: 'CHEF', email: 'priya@email.com', phone: '+91 98765 43211', status: 'Inactive' },
    { id: '3', name: 'Priya Sharma', role: 'CHEF', email: 'priya@email.com', phone: '+91 98765 43211', status: 'Inactive' },
    { id: '4', name: 'Priya Sharma', role: 'CHEF', email: 'priya@email.com', phone: '+91 98765 43211', status: 'Inactive' },
    { id: '5', name: 'Priya Sharma', role: 'CHEF', email: 'priya@email.com', phone: '+91 98765 43211', status: 'Active' },
    { id: '6', name: 'Priya Sharma', role: 'CHEF', email: 'priya@email.com', phone: '+91 98765 43211', status: 'Active' },
];

const INVITATIONS = [
    { id: '1', name: 'Hassan', phone: '+9632512122', email: 'abc@gmail.com', status: 'Pending' },
    { id: '2', name: 'Hassan', phone: '+9632512122', email: 'abc@gmail.com', status: 'Pending' },
    { id: '3', name: 'Hassan', phone: '+9632512122', email: 'abc@gmail.com', status: 'Pending' },
    { id: '4', name: 'Hassan', phone: '+9632512122', email: 'abc@gmail.com', status: 'Pending' },
];

export default function KitchenUsersScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'Users' | 'Invitations'>('Users');

    const renderUserList = () => (
        <View style={styles.listContainer}>
            <Text style={styles.sectionHeader}>Users</Text>
            {USERS.map((user) => (
                <View key={user.id} style={styles.userCard}>
                    <View style={styles.avatar}>
                        <Ionicons name={user.role === 'OWNER' ? 'shield-checkmark-outline' : 'restaurant-outline'} size={24} color="#D84315" />
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.nameRow}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <View style={styles.roleBadge}>
                                <Text style={styles.roleText}>{user.role}</Text>
                            </View>
                        </View>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        <Text style={styles.userPhone}>{user.phone}</Text>
                    </View>
                    <Pressable style={[styles.statusBadge, user.status === 'Active' ? styles.statusActive : styles.statusInactive]}>
                        <Text style={styles.statusText}>{user.status}</Text>
                    </Pressable>
                </View>
            ))}
        </View>
    );

    const renderInvitations = () => (
        <View style={styles.listContainer}>
            <View style={styles.invitationHeader}>
                <Text style={styles.sectionHeader}>Invitations</Text>
                <Pressable style={styles.inviteBtn}>
                    <Text style={styles.inviteBtnText}>Invite chef</Text>
                </Pressable>
            </View>

            {INVITATIONS.map((invite) => (
                <View key={invite.id} style={styles.inviteCard}>
                    <View style={styles.inviteTopRow}>
                        <View>
                            <Text style={styles.inviteName}>{invite.name}</Text>
                            <Text style={styles.inviteDetail}>{invite.phone}</Text>
                            <Text style={styles.inviteDetail}>{invite.email}</Text>
                        </View>
                        <View style={styles.pendingBadge}>
                            <Text style={styles.pendingText}>{invite.status}</Text>
                        </View>
                    </View>

                    <View style={styles.actionRow}>
                        <Pressable style={styles.revokeBtn}>
                            <Text style={styles.revokeText}>Revoke Invitation</Text>
                        </Pressable>
                        <Pressable style={styles.resendBtn}>
                            <Text style={styles.resendText}>Resend Invitation</Text>
                        </Pressable>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#600E10" />
                </Pressable>
                <Text style={styles.headerTitle}>Kitchen Users</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Toggle Switch */}
            <View style={styles.toggleContainer}>
                <Pressable
                    style={[styles.toggleBtn, activeTab === 'Users' && styles.toggleBtnActive]}
                    onPress={() => setActiveTab('Users')}
                >
                    <Text style={[styles.toggleText, activeTab === 'Users' && styles.toggleTextActive]}>Kitchen Users</Text>
                </Pressable>
                <Pressable
                    style={[styles.toggleBtn, activeTab === 'Invitations' && styles.toggleBtnActive]}
                    onPress={() => setActiveTab('Invitations')}
                >
                    <Text style={[styles.toggleText, activeTab === 'Invitations' && styles.toggleTextActive]}>Invitations</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'Users' ? renderUserList() : renderInvitations()}
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    toggleBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginHorizontal: 5,
    },
    toggleBtnActive: {
        backgroundColor: '#4E0D0F',
    },
    toggleText: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: '#888',
    },
    toggleTextActive: {
        color: '#FFF',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
        marginBottom: 15,
    },
    listContainer: {
        gap: 15,
    },

    // User Card Styles
    userCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFECDA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 4,
        gap: 8,
    },
    userName: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: '#1A1A1A',
    },
    roleBadge: {
        backgroundColor: '#FFECDA',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    roleText: {
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        color: '#D84315',
        textTransform: 'uppercase',
    },
    userEmail: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
    },
    userPhone: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'center',
    },
    statusActive: {
        backgroundColor: '#00C853',
    },
    statusInactive: {
        backgroundColor: '#546E7A',
    },
    statusText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },

    // Invitations Styles
    invitationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    inviteBtn: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#600E10',
        borderRadius: 20,
    },
    inviteBtnText: {
        color: '#600E10',
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
    },
    inviteCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        elevation: 1,
        marginBottom: 5,
    },
    inviteTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    inviteName: {
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    inviteDetail: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: '#333',
        marginBottom: 2,
    },
    pendingBadge: {
        backgroundColor: '#FBC02D',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    pendingText: {
        color: '#FFF',
        fontSize: 11,
        fontFamily: 'Poppins_500Medium',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    revokeBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E8906C',
        alignItems: 'center',
    },
    revokeText: {
        color: '#1A1A1A',
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },
    resendBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#4E0D0F',
        alignItems: 'center',
    },
    resendText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
    },

});
