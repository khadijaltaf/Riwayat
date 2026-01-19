
import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Image, FlatList, Alert, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const TABS = ['Logo', 'Banners', 'Audios', 'Videos', 'Images'];

// Mock Data
const MOCK_LOGOS = [
    { id: '1', type: 'image', uri: 'https://via.placeholder.com/150/FFF0E0/FF5722?text=Logo', status: 'Active' },
    { id: '2', type: 'image', uri: 'https://via.placeholder.com/150/FF5722/FFFFFF?text=Logo', status: 'Pending' },
    { id: '3', type: 'image', uri: 'https://via.placeholder.com/150/FF5722/FFFFFF?text=Logo', status: 'Pending' },
    { id: '4', type: 'image', uri: 'https://via.placeholder.com/150/FF5722/FFFFFF?text=Logo', status: 'Pending' },
];

const MOCK_BANNERS = [
    { id: '1', type: 'placeholder', title: 'Banner', status: 'Active' },
    { id: '2', type: 'placeholder', title: 'Banner', status: 'Pending' },
    { id: '3', type: 'placeholder', title: 'Banner', status: 'Pending' },
    { id: '4', type: 'placeholder', title: 'Banner', status: 'Pending' },
];

const MOCK_AUDIOS = [
    { id: '1', type: 'audio', status: 'Active' },
    { id: '2', type: 'audio', status: 'Pending' },
    { id: '3', type: 'audio', status: 'Pending' },
    { id: '4', type: 'audio', status: 'Pending' },
];

const MOCK_VIDEOS = [
    { id: '1', type: 'video', status: 'Active' },
    { id: '2', type: 'video', status: 'Pending' },
    { id: '3', type: 'video', status: 'Pending' },
    { id: '4', type: 'video', status: 'Pending' },
];

const MOCK_GALLERY = Array(12).fill(0).map((_, i) => ({
    id: String(i),
    uri: `https://via.placeholder.com/300/E0E0E0/999?text=Kitchen+${i + 1}`,
}));

export default function KitchenMediaScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Images'); // Default as per one screenshot, or Logo
    const { width } = useWindowDimensions();

    const handleUpload = () => {
        Alert.alert("Upload", `Trigger upload for ${activeTab}`);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Images':
                return (
                    <View style={styles.cardContainer}>
                        <View style={styles.gridContainer}>
                            {MOCK_GALLERY.map((img) => (
                                <Image
                                    key={img.id}
                                    source={{ uri: img.uri }}
                                    style={styles.galleryImage}
                                />
                            ))}
                        </View>
                    </View>
                );
            case 'Logo':
                return (
                    <View style={styles.cardContainer}>
                        <View style={styles.rowContainer}>
                            {MOCK_LOGOS.map((item) => (
                                <Pressable
                                    key={item.id}
                                    style={styles.itemWrapper}
                                    onPress={() => router.push({ pathname: "/kitchen/media/detail", params: { type: 'logo', id: item.id } })}
                                >
                                    <View style={styles.logoCard}>
                                        <Image source={{ uri: item.uri }} style={styles.logoImage} resizeMode="contain" />
                                    </View>
                                    <Text style={[styles.statusText, item.status === 'Active' ? styles.activeText : styles.pendingText]}>
                                        {item.status}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            case 'Banners':
                return (
                    <View style={styles.cardContainer}>
                        <View style={styles.rowContainer}>
                            {MOCK_BANNERS.map((item) => (
                                <View key={item.id} style={styles.itemWrapper}>
                                    <View style={[styles.placeholderCard, { backgroundColor: '#F26925' }]}>
                                        <Text style={styles.placeholderText}>{item.title}</Text>
                                    </View>
                                    <Text style={[styles.statusText, item.status === 'Active' ? styles.activeText : styles.pendingText]}>
                                        {item.status}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 'Audios':
                return (
                    <View style={styles.cardContainer}>
                        <View style={styles.rowContainer}>
                            {MOCK_AUDIOS.map((item) => (
                                <View key={item.id} style={styles.itemWrapper}>
                                    <View style={[styles.placeholderCard, { backgroundColor: '#F26925' }]}>
                                        <Ionicons name="musical-note" size={32} color="#FFF" />
                                    </View>
                                    <Text style={[styles.statusText, item.status === 'Active' ? styles.activeText : styles.pendingText]}>
                                        {item.status}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 'Videos':
                return (
                    <View style={styles.cardContainer}>
                        <View style={styles.rowContainer}>
                            {MOCK_VIDEOS.map((item) => (
                                <Pressable
                                    key={item.id}
                                    style={styles.itemWrapper}
                                    onPress={() => router.push({ pathname: "/kitchen/media/detail", params: { type: 'video', id: item.id } })}
                                >
                                    <View style={[styles.placeholderCard, { backgroundColor: '#F26925' }]}>
                                        <Ionicons name="videocam" size={32} color="#FFF" />
                                    </View>
                                    <Text style={[styles.statusText, item.status === 'Active' ? styles.activeText : styles.pendingText]}>
                                        {item.status}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    const getNoteText = () => {
        if (activeTab === 'Images') return "You can add many Images.";
        return `You can add many ${activeTab}, but only one can be active.`;
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#600E10" />
                </Pressable>
                <Text style={styles.headerTitle}>Kitchen Media</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabsWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <Pressable
                                key={tab}
                                style={[styles.tabItem, isActive && styles.activeTabItem]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
                            </Pressable>
                        )
                    })}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Upload Button */}
                <View style={styles.uploadRow}>
                    <Pressable style={styles.uploadBtn} onPress={handleUpload}>
                        <Text style={styles.uploadBtnText}>Upload</Text>
                    </Pressable>
                </View>

                {/* Main Content Card */}
                {renderContent()}

                {/* Note */}
                <Text style={styles.noteText}>
                    <Text style={styles.noteLabel}>Note: </Text>
                    {getNoteText()}
                </Text>

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
        paddingBottom: 15,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    tabsWrapper: {
        paddingVertical: 10,
    },
    tabsContainer: {
        paddingHorizontal: 20,
        gap: 15,
    },
    tabItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activeTabItem: {
        backgroundColor: '#600E10',
    },
    tabText: {
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: '#888',
    },
    activeTabText: {
        color: '#FFF',
    },
    content: {
        padding: 20,
    },
    uploadRow: {
        alignItems: 'flex-end',
        marginBottom: 15,
    },
    uploadBtn: {
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 20,
        backgroundColor: '#F4F7FC',
        borderWidth: 1,
        borderColor: '#600E10',
    },
    uploadBtnText: {
        color: '#600E10',
        fontFamily: 'Poppins_700Bold',
        fontSize: 13,
    },
    cardContainer: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        minHeight: 200,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        marginBottom: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 10,
    },
    galleryImage: {
        width: '30%', // roughly 3 columns
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: '#EEE',
    },

    // Row style for Logos/Banners
    rowContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    itemWrapper: {
        width: '22%', // 4 items per row approx
        alignItems: 'center',
    },
    logoCard: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#FFF0E0',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#E6E6E6',
    },
    logoImage: {
        width: '80%',
        height: '80%',
    },
    placeholderCard: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    placeholderText: {
        color: '#FFF',
        fontSize: 10,
        fontFamily: 'Poppins_500Medium',
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Poppins_500Medium',
    },
    activeText: {
        color: '#4CAF50', // Green
    },
    pendingText: {
        color: '#FF9800', // Orange
    },

    noteText: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
        lineHeight: 20,
    },
    noteLabel: {
        color: '#FF5722', // Orange
        fontFamily: 'Poppins_600SemiBold',
    },
});
