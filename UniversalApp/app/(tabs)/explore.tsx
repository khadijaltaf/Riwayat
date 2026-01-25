
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Image, Switch, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

const DISHES = [
  {
    id: '1',
    name: 'Butter Chicken',
    category: 'Main Course',
    price: '280',
    orders: '45',
    image: 'https://images.unsplash.com/photo-1603894584202-938269b3e153?w=400',
    available: true,
  },
  {
    id: '2',
    name: 'Butter Chicken',
    category: 'Main Course',
    price: '280',
    orders: '45',
    image: 'https://images.unsplash.com/photo-1603894584202-938269b3e153?w=400',
    available: true,
  },
  {
    id: '3',
    name: 'Butter Chicken',
    category: 'Main Course',
    price: '280',
    orders: '45',
    image: 'https://images.unsplash.com/photo-1603894584202-938269b3e153?w=400',
    available: true,
  },
];

export default function MenuScreen() {
  const [search, setSearch] = useState('');
  const [ownerName, setOwnerName] = useState('Partner');
  const [kitchenName, setKitchenName] = useState('My Kitchen');
  const router = useRouter();

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('owner_name').eq('id', user.id).single();
        if (profile?.owner_name) setOwnerName(profile.owner_name);

        const { data: kitchen } = await supabase.from('kitchens').select('name').eq('owner_id', user.id).single();
        if (kitchen?.name) setKitchenName(kitchen.name);
      }
    } catch (e) {
      console.warn('Error fetching profile in Menu', e);
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

        {/* Search and Add */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#B0B0B0" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search dishes..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#B0B0B0"
            />
          </View>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={30} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Menu Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Total Dishes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        {/* Dishes List */}
        <View style={styles.dishesList}>
          {DISHES.map((dish) => (
            <View key={dish.id} style={styles.dishCard}>
              <View style={styles.dishMainInfo}>
                <Image source={{ uri: dish.image }} style={styles.dishImage} />
                <View style={styles.dishTextContent}>
                  <View style={styles.dishHeader}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Pressable>
                      <Ionicons name="ellipsis-vertical" size={20} color="#B0B0B0" />
                    </Pressable>
                  </View>
                  <Text style={styles.dishCategory}>{dish.category}</Text>

                  <View style={styles.availabilityRow}>
                    <Text style={styles.dishPrice}>${dish.price}</Text>
                    <View style={styles.toggleRow}>
                      <Text style={styles.dishOrders}>{dish.orders} orders</Text>
                      <Switch
                        value={dish.available}
                        trackColor={{ false: '#E0E0E0', true: '#4CD964' }}
                        thumbColor="#FFFFFF"
                        onValueChange={() => { }}
                        style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.dishActions}>
                <Pressable style={styles.outlineAction}>
                  <Text style={styles.outlineActionText}>Edit Details</Text>
                </Pressable>
                <Pressable style={styles.solidAction}>
                  <Text style={styles.solidActionText}>View Stats</Text>
                </Pressable>
              </View>
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
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 54,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Poppins_400Regular',
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#5C1414',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#5C1414',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
    gap: 12,
  },
  statItem: {
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
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#000000',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#E8906C',
    marginTop: 2,
    textAlign: 'center',
  },
  dishesList: {
    gap: 20,
  },
  dishCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
  },
  dishMainInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  dishTextContent: {
    flex: 1,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dishName: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#000000',
    flex: 1,
  },
  dishCategory: {
    fontSize: 14,
    color: '#E8906C',
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 2,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dishPrice: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#000000',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dishOrders: {
    fontSize: 12,
    color: '#B0B0B0',
    fontFamily: 'Poppins_400Regular',
  },
  dishActions: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineAction: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E8906C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineActionText: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#000000',
  },
  solidAction: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5C1414',
    justifyContent: 'center',
    alignItems: 'center',
  },
  solidActionText: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
  },
});

