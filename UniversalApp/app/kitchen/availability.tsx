
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const DAYS = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function KitchenAvailabilityScreen() {
    const [availability, setAvailability] = useState(
        DAYS.map(day => ({
            day,
            isOpen: true,
            openTime: '09:00 AM',
            closeTime: '09:00 PM'
        }))
    );
    const router = useRouter();

    const toggleDay = (index: number) => {
        const newAvailability = [...availability];
        newAvailability[index].isOpen = !newAvailability[index].isOpen;
        setAvailability(newAvailability);
    };

    const handleSave = () => {
        Alert.alert('Success', 'Operational hours updated successfully');
        router.back();
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#5C1414" />
                </Pressable>
                <Text style={styles.headerTitle}>Operational Hours</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.subtitle}>Set your weekly kitchen schedule</Text>

                <View style={styles.listContainer}>
                    {availability.map((item, index) => (
                        <View key={item.day} style={styles.dayRow}>
                            <View style={styles.dayHeader}>
                                <Text style={styles.dayName}>{item.day}</Text>
                                <Switch
                                    value={item.isOpen}
                                    onValueChange={() => toggleDay(index)}
                                    trackColor={{ false: '#767577', true: '#E8906C' }}
                                    thumbColor={item.isOpen ? '#5C1414' : '#f4f3f4'}
                                />
                            </View>

                            {item.isOpen && (
                                <View style={styles.timeContainer}>
                                    <Pressable style={styles.timePicker}>
                                        <Text style={styles.timeLabel}>Open</Text>
                                        <Text style={styles.timeValue}>{item.openTime}</Text>
                                    </Pressable>
                                    <View style={styles.separator} />
                                    <Pressable style={styles.timePicker}>
                                        <Text style={styles.timeLabel}>Close</Text>
                                        <Text style={styles.timeValue}>{item.closeTime}</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </Pressable>
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
    subtitle: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginBottom: 24,
    },
    listContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 16,
        marginBottom: 32,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    dayRow: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dayName: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 12,
        gap: 12,
    },
    timePicker: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        color: '#999',
        marginBottom: 2,
    },
    timeValue: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
    },
    separator: {
        width: 1,
        height: 20,
        backgroundColor: '#DDD',
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
