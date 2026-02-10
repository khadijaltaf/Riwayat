import { api } from '@/lib/api-client';
import { localStorageService } from '@/services/local-storage-service';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const CATEGORIES = [
    { id: '1', name: 'Pakistani', icon: 'restaurant-outline' },
    { id: '2', name: 'Chinese', icon: 'fast-food-outline' },
    { id: '3', name: 'Bakery', icon: 'ice-cream-outline' },
    { id: '4', name: 'Desserts', icon: 'cafe-outline' },
    { id: '5', name: 'Fast Food', icon: 'pizza-outline' },
    { id: '6', name: 'Homemade Snacks', icon: 'nutrition-outline' },
    { id: '7', name: 'Continental', icon: 'filter-outline' },
    { id: '8', name: 'Healthy/Salads', icon: 'leaf-outline' },
];

export default function CategoriesScreen() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        const progress = await localStorageService.getOnboardingProgress();
        if (progress?.categories) {
            setSelectedCategories(progress.categories);
        }
    };

    const toggleCategory = (id: string) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(item => item !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    const handleContinue = async () => {
        if (selectedCategories.length === 0) return Alert.alert('Error', 'Please select at least one category');

        setLoading(true);
        try {
            // Save to Local Storage & API
            await localStorageService.saveOnboardingProgress({
                categories: selectedCategories,
                step: 'id_verification'
            });

            await api.onboarding.updateSession({
                phone: (await localStorageService.getOnboardingProgress())?.phone,
                categories: selectedCategories,
                step: 'id_verification',
                updated_at: new Date().toISOString()
            });

            // Navigate to Screen: ID Verification
            router.push({ pathname: '/(auth)/id-verification', params: { phone } });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="dark" />
            <View style={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="call" size={24} color="#5C1414" />
                    </View>
                    <Text style={styles.stepText}>4/6</Text>
                </View>

                {/* Title and Subtitle */}
                <Text style={styles.title}>Menu Categories</Text>
                <Text style={styles.subtitle}>
                    What kind of food do you specialize in? Select all that apply.
                </Text>

                {/* Categories Grid */}
                <ScrollView
                    style={styles.categoriesList}
                    contentContainerStyle={styles.categoriesContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.grid}>
                        {CATEGORIES.map((item) => {
                            const isSelected = selectedCategories.includes(item.id);
                            return (
                                <Pressable
                                    key={item.id}
                                    style={[styles.categoryCard, isSelected && styles.selectedCard]}
                                    onPress={() => toggleCategory(item.id)}
                                >
                                    <View style={[styles.categoryIconWrapper, isSelected && styles.selectedIconWrapper]}>
                                        <Ionicons
                                            name={item.icon as any}
                                            size={28}
                                            color={isSelected ? '#FFFFFF' : '#E8906C'}
                                        />
                                    </View>
                                    <Text style={[styles.categoryText, isSelected && styles.selectedText]}>
                                        {item.name}
                                    </Text>
                                    {isSelected && (
                                        <View style={styles.checkmark}>
                                            <Ionicons name="checkmark-circle" size={20} color="#5C1414" />
                                        </View>
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                </ScrollView>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.nextButton, selectedCategories.length === 0 && styles.disabledButton]}
                        onPress={handleContinue}
                        disabled={selectedCategories.length === 0}
                    >
                        <Text style={styles.nextButtonText}>Continue</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FAFF',
    },
    scrollContent: {
        padding: 24,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    stepText: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#800000',
    },
    title: {
        fontSize: 32,
        fontFamily: 'Poppins_700Bold',
        color: '#5C1414',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        color: '#4A4A4A',
        lineHeight: 26,
        marginBottom: 24,
    },
    categoriesList: {
        flex: 1,
    },
    categoriesContent: {
        paddingBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    categoryCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 8,
        position: 'relative',
    },
    selectedCard: {
        borderColor: '#E8906C',
        backgroundColor: '#FFEFE6',
    },
    categoryIconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F4FAFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    selectedIconWrapper: {
        backgroundColor: '#E8906C',
    },
    categoryText: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#5C1414',
        textAlign: 'center',
    },
    selectedText: {
        color: '#5C1414',
    },
    checkmark: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    footer: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 16,
    },
    backButton: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    backButtonText: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
    },
    nextButton: {
        flex: 1.5,
        paddingVertical: 18,
        borderRadius: 30,
        backgroundColor: '#5C1414',
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    disabledButton: {
        opacity: 0.5,
    },
});
