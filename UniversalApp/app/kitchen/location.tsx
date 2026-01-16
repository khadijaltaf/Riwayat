
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function KitchenLocationScreen() {
    const [address, setAddress] = useState({
        building: '',
        street: '',
        area: '',
        city: 'Karachi',
    });
    const router = useRouter();

    const handleSave = () => {
        if (!address.street || !address.area) {
            return Alert.alert('Error', 'Please provide at least street and area');
        }
        Alert.alert('Success', 'Location updated successfully');
        router.back();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#5C1414" />
                </Pressable>
                <Text style={styles.headerTitle}>Location Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Pressable style={styles.mapPlaceholder}>
                    <Ionicons name="map-outline" size={40} color="#E8906C" />
                    <Text style={styles.mapText}>Pick from Map</Text>
                    <View style={styles.mapBadge}>
                        <Text style={styles.mapBadgeText}>Coming Soon</Text>
                    </View>
                </Pressable>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Building / Shop Name (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type Here"
                            value={address.building}
                            onChangeText={(text) => setAddress({ ...address, building: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Street / Road</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type Here"
                            value={address.street}
                            onChangeText={(text) => setAddress({ ...address, street: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Area / Sector</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type Here"
                            value={address.area}
                            onChangeText={(text) => setAddress({ ...address, area: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={address.city}
                            editable={false}
                        />
                    </View>
                </View>

                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Confirm Location</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
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
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#5C1414',
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    mapPlaceholder: {
        height: 180,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 2,
        borderColor: '#FFEFE6',
        borderStyle: 'dashed',
    },
    mapText: {
        marginTop: 12,
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#5C1414',
    },
    mapBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FFEFE6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    mapBadgeText: {
        fontSize: 10,
        fontFamily: 'Poppins_700Bold',
        color: '#E8906C',
    },
    form: {
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        color: '#1A1A1A',
    },
    disabledInput: {
        backgroundColor: '#F5F5F5',
        color: '#999',
    },
    saveButton: {
        backgroundColor: '#5C1414',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },
});
