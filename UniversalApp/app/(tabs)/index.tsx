
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Switch, Dimensions, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

// Dynamic card width based on screen size (2 columns)
const CARD_WIDTH = (width - 48 - 20) / 3; // 48 padding, 20 gap

export default function DashboardScreen() {
  const [isOnline, setIsOnline] = useState(true);
  const [ownerName, setOwnerName] = useState('Partner');
  const [kitchenName, setKitchenName] = useState('My Kitchen');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      // For demo purposes, we might fetch the last updated session or a logged in user
      // Since we don't have a full auth context provider in this snippet, we'll try to fetch the latest onboarding session
      const { data, error } = await supabase
        .from('onboarding_sessions')
        .select('owner_name, kitchen_name')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        if (data.owner_name) setOwnerName(data.owner_name);
        // Kitchen name might be in a different table or field, assuming mocked for now if not in session
      }
    } catch (e) {
      console.log('Error fetching profile', e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProfile().then(() => setRefreshing(false));
  }, []);

  const handleGridAction = (label: string) => {
    if (label === 'Chats') {
      router.push('/chat' as any);
    } else if (label === 'Feedback') {
      router.push('/feedback' as any);
    } else if (label === 'view orders') {
      router.push('/(tabs)/orders');
    } else {
      console.log(label);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' }}
            style={styles.profileImage}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.greetingText}>Hello, {ownerName}</Text>
            <Text style={styles.kitchenNameText}>{kitchenName}</Text>
          </View>
        </View>
        <Pressable style={styles.notificationButton} onPress={() => router.push('/notifications' as any)}>
          <View style={styles.notifWrapper}>
            <Ionicons name="notifications" size={22} color="#FF7043" />
            <View style={styles.notifDot} />
          </View>
        </Pressable>
      </View>

      {/* Kitchen Status Card */}
      <View style={styles.statusCardWrapper}>
        <LinearGradient
          colors={['#800000', '#C42427']}
          style={styles.statusCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Kitchen Status</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={'#FFFFFF'}
              onValueChange={setIsOnline}
              value={isOnline}
              ios_backgroundColor="#3e3e3e"
              style={styles.statusSwitch}
            />
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconBadge}>
                <Ionicons name="logo-usd" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.statLabel}>Total Sales</Text>
              <Text style={styles.statValue}>$842</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconBadge}>
                <Ionicons name="cube-outline" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.statLabel}>Today</Text>
              <Text style={styles.statValue}>24 orders</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.gridContainer}>
        {[
          { icon: 'cube-outline', label: 'view orders' },
          { icon: 'logo-usd', label: 'view earnings' },
          { icon: 'restaurant-outline', label: 'Dishes' },
          { icon: 'pricetag-outline', label: 'Discount' },
          { icon: 'chatbox-ellipses-outline', label: 'Feedback' },
          { icon: 'chatbubbles-outline', label: 'Chats' },
        ].map((item, index) => (
          <Pressable key={index} style={styles.gridWrapper} onPress={() => handleGridAction(item.label)}>
            <View style={styles.actionCard}>
              <Ionicons name={item.icon as any} size={28} color="#D84315" />
            </View>
            <Text style={styles.actionLabel} numberOfLines={1}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recent Updates */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitleSmall}>Recent Updates</Text>
        <Pressable>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>

      <View style={styles.updatesCard}>
        {[
          { icon: 'notifications-outline', title: 'Payment received', sub: 'Payout of $250 completed', time: '1h ago' },
          { icon: 'notifications-outline', title: 'New Review', sub: 'Customer rated 5 stars', time: '3h ago' }
        ].map((item, idx) => (
          <View key={idx} style={[styles.updateRow, idx === 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.updateIconCircle}>
              <Ionicons name={item.icon as any} size={20} color="#FF7043" />
            </View>
            <View style={styles.updateTextContent}>
              <Text style={styles.updateHeading}>{item.title}</Text>
              <Text style={styles.updateSubheading}>{item.sub}</Text>
            </View>
            <Text style={styles.updateTimeText}>{item.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FF',
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
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTextContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  greetingText: {
    fontSize: 14, // Smaller
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  kitchenNameText: {
    fontSize: 20, // Adjusted
    fontFamily: 'Poppins_600SemiBold',
    color: '#1A1A1A',
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  notifWrapper: {
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  statusCardWrapper: {
    marginBottom: 30,
    borderRadius: 30,
    shadowColor: '#600E10',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  statusCard: {
    borderRadius: 30,
    padding: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    opacity: 0.95,
  },
  statusSwitch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  // Responsive Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 25,
  },
  gridWrapper: {
    width: '33.33%', // 3 columns
    padding: 8,
    alignItems: 'center',
  },
  actionCard: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F5FA',
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: '#E65100', // Matches screenshot accent
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleSmall: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#1A1A1A',
  },
  viewAllText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
  },
  updatesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  updateIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF1ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  updateTextContent: {
    flex: 1,
  },
  updateHeading: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1A1A1A',
  },
  updateSubheading: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
    marginTop: 2,
  },
  updateTimeText: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#AAA',
    marginLeft: 8,
  },
});
