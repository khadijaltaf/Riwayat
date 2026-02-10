import { api } from '@/lib/api-client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, Platform, Pressable, StatusBar as RNStatusBar, SafeAreaView, StyleSheet, Text, View } from 'react-native';

// Mock Data matching screenshot
const MOCK_CHATS = [
    {
        id: '1',
        name: 'Rahul Sharma',
        message: 'When will my order arrive?',
        subMessage: 'Order #1245',
        time: '5 mins ago',
        unread: 2,
        avatar: null, // text avatar
        avatarColor: '#FFE0B2',
        avatarTextColor: '#E65100'
    },
    {
        id: '2',
        name: 'Riwayat Support',
        message: 'We have processed your payout request',
        subMessage: '',
        time: '1 hour ago',
        unread: 0,
        avatar: null,
        avatarColor: '#FFCCBC',
        avatarTextColor: '#BF360C'
    },
    {
        id: '3',
        name: 'Priya Patel',
        message: 'Can you add extra spice?',
        subMessage: 'Order #1244',
        time: '2 hours ago',
        unread: 0,
        avatar: null,
        avatarColor: '#FFE0B2',
        avatarTextColor: '#E65100'
    },
    {
        id: '4',
        name: 'Campaign Team',
        message: 'New promotional offer available',
        subMessage: '',
        time: '1 day ago',
        unread: 1,
        avatar: null,
        avatarColor: '#FFE0B2',
        avatarTextColor: '#E65100'
    },
];

export default function ChatListScreen() {
    const router = useRouter();
    const [chats, setChats] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const { data: { user } } = await api.auth.getUser();
            if (!user) return; // Handle auth redirect if needed

            // We need the user's phone to find conversations
            // Assuming phone is stored in metadata or we can get it from profile
            const { data: profile } = await api.profile.get(user.id);

            if (profile?.phone) {
                const { data, error } = await api.chat.getConversations(profile.phone);
                if (error) throw error;

                // Map to UI format
                // In a real app we'd fetch the OTHER participant's name/avatar here too
                // For now, we'll format what we have
                const formatted = (data || []).map((c: any) => {
                    const otherPhone = c.participant_1 === profile.phone ? c.participant_2 : c.participant_1;
                    return {
                        id: c.id,
                        name: otherPhone || 'Unknown User', // Ideally fetch name from profiles table using otherPhone
                        message: c.last_message || 'Start a conversation',
                        time: new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        unread: 0, // Need read status logic in DB
                        avatarColor: '#FFE0B2',
                        avatarTextColor: '#E65100',
                        otherPhone: otherPhone
                    };
                });
                setChats(formatted);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <Pressable
            style={styles.chatCard}
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id, name: item.name, userPhone: item.otherPhone } })}
        >
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
                <Ionicons name="person-outline" size={24} color={item.avatarTextColor} />
            </View>

            {/* Content */}
            <View style={styles.chatContent}>
                <View style={styles.topRow}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>

                <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StatusBar style="dark" />

                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#600E10" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Chats</Text>
                </View>

                {/* List */}
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={fetchChats}
                    ListEmptyComponent={
                        !loading ? <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No conversations yet</Text> : null
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F4F7FC',
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F7FC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F4F7FC',
    },
    backButton: {
        paddingRight: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    listContent: {
        padding: 20,
        gap: 15,
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'flex-start', // Top align for dynamic content
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    chatContent: {
        flex: 1,
        marginRight: 10,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
    },
    time: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#888',
    },
    message: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: '#4A4A4A',
        marginBottom: 2,
    },
    subMessage: {
        fontSize: 12,
        fontFamily: 'Poppins_500Medium',
        color: '#FF7043', // Orange/Red for order #
        marginTop: 2,
    },
    badge: {
        backgroundColor: '#FF3D00', // Bright orange/red
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        position: 'absolute',
        right: 16,
        top: 40, // Below time
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
    },
});
