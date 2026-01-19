import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

// UI Theme Colors
const THEME = {
    primary: '#600E10',
    secondary: '#FFFFFF',
    text: '#1A1A1A',
    gray: '#4A4A4A',
    lightGray: '#E0E0E0',
    bg: '#F4FAFF',
    orange: '#E65100',
    green: '#2E7D32',
};

export default function FeedbackListScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'Pending' | 'Publish' | 'All'>('Pending');
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        fetchFeedbacks();
    }, [activeTab]);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            let query = supabase.from('feedbacks').select('*').order('created_at', { ascending: false });

            if (activeTab === 'Pending') {
                query = query.eq('status', 'PENDING');
            } else if (activeTab === 'Publish') {
                query = query.eq('status', 'PUBLISHED');
            }

            const { data, error } = await query;
            if (error) throw error;
            setFeedbacks(data || []);
        } catch (e) {
            console.error('Error fetching feedbacks:', e);
            // Mock data if table doesn't exist yet or for demo
            setFeedbacks([
                { id: '1', order_id: '515221', customer_name: 'Salman', rating: 5, comment: 'Amazing Butter Chicken! The taste was authentic and reminded me of my grandmother\'s cooking.', status: 'PENDING', created_at: new Date().toISOString(), images: ['https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200'] },
                { id: '2', order_id: '515222', customer_name: 'Salman', rating: 5, comment: 'Amazing Butter Chicken! The taste was authentic and reminded me of my grandmother\'s cooking.', status: 'PUBLISHED', created_at: new Date().toISOString(), images: ['https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200'] },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color={THEME.primary} />
                </Pressable>
                <Text style={styles.headerTitle}>Feedback</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Orders"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Stats row */}
                <View style={styles.statsRow}>
                    <StatCard label="Total" count={10} color={THEME.primary} />
                    <StatCard label="Pending" count={6} color="#FF9800" />
                    <StatCard label="Published" count={5} color={THEME.green} />
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    {['Pending', 'Publish', 'All'].map((tab) => (
                        <Pressable
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab as any)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </Pressable>
                    ))}
                </View>

                {/* Feedback List */}
                {loading ? (
                    <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 40 }} />
                ) : (
                    feedbacks.map((f) => (
                        <FeedbackCard
                            key={f.id}
                            feedback={f}
                            onReply={() => router.push({ pathname: '/feedback/[id]', params: { id: f.id } })}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}

function StatCard({ label, count, color }: { label: string; count: number; color: string }) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statCount}>{count}</Text>
            <Text style={[styles.statLabel, { color }]}>{label}</Text>
        </View>
    );
}

function FeedbackCard({ feedback, onReply }: { feedback: any; onReply: () => void }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.customerName}>{feedback.customer_name} {feedback.order_id && `REF: ${feedback.order_id}`}</Text>
                    <Text style={styles.timeText}>2 hour ago</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: feedback.status === 'PENDING' ? '#FFAC3320' : '#00C85320' }]}>
                    <Text style={[styles.statusText, { color: feedback.status === 'PENDING' ? '#FFAC33' : '#00C853' }]}>
                        {feedback.status === 'PENDING' ? 'Pending' : 'Approved'}
                    </Text>
                </View>
            </View>

            <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                    <Ionicons key={s} name="star" size={18} color={s <= feedback.rating ? '#FFD600' : '#E0E0E0'} />
                ))}
            </View>

            <Text style={styles.commentText}>{feedback.comment}</Text>

            {feedback.images && feedback.images.length > 0 && (
                <View style={styles.imageInfo}>
                    <Ionicons name="image-outline" size={16} color={THEME.gray} />
                    <Text style={styles.imageCountText}>{feedback.images.length}</Text>
                </View>
            )}

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
                <Pressable style={styles.replyBtn} onPress={onReply}>
                    <Text style={styles.replyBtnText}>Reply</Text>
                    <Ionicons name="arrow-undo-outline" size={18} color={THEME.gray} />
                </Pressable>
                <Pressable style={styles.manageBtn}>
                    <Text style={styles.manageBtnText}>Feedback manage</Text>
                    <Ionicons name="options-outline" size={18} color={THEME.secondary} />
                </Pressable>
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
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: '#F4FAFF',
    },
    backBtn: {
        padding: 5,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: THEME.primary,
    },
    scrollContent: {
        padding: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 30,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        marginHorizontal: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statCount: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: THEME.text,
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        marginTop: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 25,
        gap: 20,
    },
    tab: {
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: THEME.primary,
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#666',
    },
    activeTabText: {
        color: '#FFF',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    customerName: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: THEME.text,
    },
    timeText: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Poppins_400Regular',
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 15,
    },
    statusText: {
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
    },
    ratingRow: {
        flexDirection: 'row',
        gap: 2,
        marginBottom: 10,
    },
    commentText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        lineHeight: 20,
        marginBottom: 10,
    },
    imageInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 15,
    },
    imageCountText: {
        fontSize: 12,
        color: THEME.gray,
        fontFamily: 'Poppins_600SemiBold',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 15,
    },
    cardFooter: {
        flexDirection: 'row',
        gap: 10,
    },
    replyBtn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFD180',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    replyBtnText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: THEME.text,
    },
    manageBtn: {
        flex: 1.2,
        height: 44,
        borderRadius: 12,
        backgroundColor: THEME.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    manageBtnText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: THEME.secondary,
    },
});
