
import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { storageService } from '@/services/storage-service';

const TABS = ['Logo', 'Banners', 'Audios', 'Videos', 'Images'];

export default function KitchenMediaScreen() {
    const [activeTab, setActiveTab] = useState('Images');
    const [uploading, setUploading] = useState(false);
    const [mediaList, setMediaList] = useState<string[]>([]);
    const router = useRouter();

    const handleUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            setUploading(true);
            const { publicUrl, error } = await storageService.uploadImage(result.assets[0].uri);
            setUploading(false);

            if (error) {
                Alert.alert('Upload Failed', error);
            } else if (publicUrl) {
                setMediaList([publicUrl, ...mediaList]);
                Alert.alert('Success', 'Media uploaded successfully!');
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#5C1414" />
                </Pressable>
                <Text style={styles.headerTitle}>Kitchen Media</Text>
            </View>

            {/* Category Tabs */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    {TABS.map((tab) => (
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

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.uploadRow}>
                    <Pressable style={styles.uploadButton} onPress={handleUpload} disabled={uploading}>
                        {uploading ? <ActivityIndicator color="#5C1414" /> : <Text style={styles.uploadButtonText}>Upload</Text>}
                    </Pressable>
                </View>

                <View style={styles.mediaGrid}>
                    {mediaList.map((url, index) => (
                        <View key={index} style={styles.mediaCard}>
                            <Image source={{ uri: url }} style={styles.mediaImage} />
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Active</Text>
                            </View>
                        </View>
                    ))}

                    {/* Placeholder if empty */}
                    {mediaList.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="images-outline" size={60} color="#DDD" />
                            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} uploaded yet</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.noteText}>Note: You can add many {activeTab}.</Text>
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
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#F4FAFF',
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#5C1414',
    },
    tabsContainer: {
        marginBottom: 20,
    },
    tabsScroll: {
        paddingHorizontal: 24,
        gap: 12,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    activeTab: {
        backgroundColor: '#5C1414',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#666',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    uploadRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    uploadButton: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E8906C',
        backgroundColor: '#FFFFFF',
        minWidth: 100,
        alignItems: 'center',
    },
    uploadButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
    },
    mediaGrid: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 16,
        minHeight: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    mediaCard: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    mediaImage: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        right: 4,
    },
    statusText: {
        fontSize: 10,
        color: '#4CAF50',
        textAlign: 'center',
        fontFamily: 'Poppins_700Bold',
    },
    emptyContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 14,
        color: '#999',
        fontFamily: 'Poppins_400Regular',
    },
    noteText: {
        marginTop: 20,
        fontSize: 12,
        color: '#E8906C',
        fontFamily: 'Poppins_600SemiBold',
    }
});
