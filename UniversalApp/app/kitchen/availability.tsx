import { api } from '@/lib/api-client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Modal, Pressable, StyleSheet as RNStyleSheet, ScrollView, Switch, Text, View } from 'react-native';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
type SlotStatus = 'Active' | 'Inactive' | 'Pending';

interface TimeSlot {
    type: MealType;
    startTime: string;
    endTime: string;
    isActive: boolean;
    status: SlotStatus;
}

interface DaySchedule {
    day: string;
    slots: TimeSlot[];
    isOpen: boolean;
}

const DEFAULT_SCHEDULE: DaySchedule[] = DAYS.map(day => ({
    day,
    isOpen: day === 'Monday',
    slots: [
        { type: 'Breakfast', startTime: '6:00', endTime: '7:00', isActive: false, status: 'Inactive' },
        { type: 'Lunch', startTime: '6:00', endTime: '7:00', isActive: true, status: 'Active' },
        { type: 'Dinner', startTime: '6:00', endTime: '7:00', isActive: false, status: 'Pending' },
    ]
}));

export default function AvailabilityScreen() {
    const router = useRouter();
    const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [submitModalVisible, setSubmitModalVisible] = useState(false);
    const [closeModalVisible, setCloseModalVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ dayIndex: number, slotIndex: number } | null>(null);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const { data: { user } } = await api.auth.getUser();
            if (user) {
                const { data: kitchen } = await api.kitchen.get(user.id);

                if (kitchen?.schedule) {
                    setSchedule(kitchen.schedule as DaySchedule[]);
                }
            }
        } catch (e) {
            console.warn('Error fetching schedule', e);
        } finally {
            setLoading(false);
        }
    };

    const saveSchedule = async () => {
        try {
            const { data: { user } } = await api.auth.getUser();
            if (user) {
                const { error } = await api.kitchen.update(user.id, {
                    schedule: schedule
                });

                if (error) throw error;
            }
            setSubmitModalVisible(true);
        } catch (e: any) {
            Alert.alert('Save Failed', e.message);
        }
    };

    // Toggle Accordion
    const toggleDay = (index: number) => {
        setSchedule(prev => prev.map((item, i) => ({
            ...item,
            isOpen: i === index ? !item.isOpen : false // Close others
        })));
    };

    // Toggle Slot Switch Logic
    const handleToggleAttempt = (dayIndex: number, slotIndex: number, currentValue: boolean) => {
        if (currentValue === true) {
            // User is trying to turn OFF (Inactive) -> Show Close Modal
            setSelectedSlot({ dayIndex, slotIndex });
            setCloseModalVisible(true);
        } else {
            // User is turning ON -> Just toggle immediately (or maybe show "Open" modal if designs existed)
            toggleSlot(dayIndex, slotIndex);
        }
    };

    const toggleSlot = (dayIndex: number, slotIndex: number) => {
        setSchedule(prev => {
            const newSchedule = [...prev];
            const slot = newSchedule[dayIndex].slots[slotIndex];
            slot.isActive = !slot.isActive;
            // Update status text logic (mock)
            slot.status = slot.isActive ? 'Active' : 'Inactive';
            return newSchedule;
        });
    };

    const confirmCloseKitchen = () => {
        Keyboard.dismiss();
        if (selectedSlot) {
            toggleSlot(selectedSlot.dayIndex, selectedSlot.slotIndex);
        }
        setCloseModalVisible(false);
    };

    const openEditModal = (dayIndex: number, slotIndex: number) => {
        setSelectedSlot({ dayIndex, slotIndex });
        setEditModalVisible(true);
    };

    const handleSubmitRequest = () => {
        Keyboard.dismiss();
        saveSchedule();
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#600E10" />
                </Pressable>
                <Text style={styles.headerTitle}>Kitchen Availability</Text>
                <View style={{ width: 28 }} />
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#600E10" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={styles.infoText}>
                        If your kitchen is active, changes need admin approval.
                        If it's in draft, changes update instantly.
                    </Text>

                    {schedule.map((dayItem, dayIndex) => (
                        <View key={dayItem.day} style={styles.dayContainer}>
                            <Pressable
                                style={[styles.dayHeader, dayItem.isOpen && styles.dayHeaderOpen]}
                                onPress={() => toggleDay(dayIndex)}
                            >
                                <Text style={styles.dayTitle}>{dayItem.day}</Text>
                                <Ionicons name={dayItem.isOpen ? "chevron-up" : "chevron-down"} size={20} color="#333" />
                            </Pressable>

                            {dayItem.isOpen && (
                                <View style={styles.slotsContainer}>
                                    {dayItem.slots.map((slot, slotIndex) => (
                                        <View key={slot.type} style={styles.slotRow}>
                                            <Switch
                                                trackColor={{ false: "#E0E0E0", true: "#4CAF50" }}
                                                thumbColor={"#FFF"}
                                                ios_backgroundColor="#E0E0E0"
                                                onValueChange={() => handleToggleAttempt(dayIndex, slotIndex, slot.isActive)}
                                                value={slot.isActive}
                                                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                            />
                                            <View style={styles.slotInfo}>
                                                <Text style={styles.slotType}>{slot.type}</Text>
                                                <Text style={styles.slotTime}>{slot.startTime} to {slot.endTime}</Text>
                                            </View>

                                            {/* Status Badge */}
                                            <View style={[
                                                styles.statusBadge,
                                                slot.status === 'Active' ? styles.badgeActive :
                                                    slot.status === 'Pending' ? styles.badgePending : styles.badgeInactive
                                            ]}>
                                                <Text style={[
                                                    styles.statusText,
                                                    slot.status === 'Active' ? styles.textActive :
                                                        slot.status === 'Pending' ? styles.textPending : styles.textInactive
                                                ]}>
                                                    {slot.status}
                                                </Text>
                                            </View>

                                            <Pressable onPress={() => openEditModal(dayIndex, slotIndex)} style={styles.editIcon}>
                                                <Ionicons name="create-outline" size={20} color="#666" />
                                            </Pressable>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}

                    <Pressable style={styles.submitBtn} onPress={handleSubmitRequest}>
                        <Text style={styles.submitBtnText}>Submit</Text>
                    </Pressable>
                </ScrollView>
            )}

            {/* Edit Time Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectedSlot ? schedule[selectedSlot.dayIndex].day : 'Day'}
                            </Text>
                        </View>

                        <View style={styles.checkboxRow}>
                            <Ionicons name="checkbox" size={24} color="#F28B50" />
                            <Text style={styles.checkboxText}>
                                Kitchen Open for {selectedSlot ? schedule[selectedSlot.dayIndex].slots[selectedSlot.slotIndex].type : 'Meal'} on {selectedSlot ? schedule[selectedSlot.dayIndex].day : 'Day'}
                            </Text>
                        </View>

                        <Text style={styles.inputLabel}>Start Time</Text>
                        <Pressable style={styles.timeInput}>
                            <Text style={styles.timeText}>6:00PM</Text>
                            <Ionicons name="time-outline" size={20} color="#333" />
                        </Pressable>

                        <Text style={styles.inputLabel}>End Time</Text>
                        <Pressable style={styles.timeInput}>
                            <Text style={styles.timeText}>8:00PM</Text>
                            <Ionicons name="time-outline" size={20} color="#333" />
                        </Pressable>

                        <View style={styles.modalActions}>
                            <Pressable style={styles.modalCancelBtn} onPress={() => setEditModalVisible(false)}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.modalSubmitBtn} onPress={() => setEditModalVisible(false)}>
                                <Text style={styles.modalSubmitText}>Submit</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* "Close Your Kitchen" Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={closeModalVisible}
                onRequestClose={() => setCloseModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModalContent}>
                        <Pressable onPress={() => setCloseModalVisible(false)} style={styles.closeIcon}>
                            <Ionicons name="close" size={24} color="#333" />
                        </Pressable>

                        <Text style={styles.confirmTitle}>Close Your Kitchen</Text>
                        <Text style={styles.confirmDesc}>
                            Your kitchen will be unavailable for Customers on {selectedSlot ? schedule[selectedSlot.dayIndex].day : 'Day'} for {selectedSlot ? schedule[selectedSlot.dayIndex].slots[selectedSlot.slotIndex].type : 'Meal'}. do you want to confirm?
                        </Text>

                        <View style={styles.confirmActions}>
                            <Pressable style={styles.confirmCancelBtn} onPress={() => setCloseModalVisible(false)}>
                                <Text style={styles.confirmCancelText}>No</Text>
                            </Pressable>
                            <Pressable style={styles.confirmDoneBtn} onPress={confirmCloseKitchen}>
                                <Text style={styles.confirmDoneText}>Yes</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Submit Request Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={submitModalVisible}
                onRequestClose={() => setSubmitModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmModalContent}>
                        <Pressable onPress={() => setSubmitModalVisible(false)} style={styles.closeIcon}>
                            <Ionicons name="close" size={24} color="#333" />
                        </Pressable>

                        <View style={styles.hourglassIcon}>
                            <Ionicons name="hourglass-outline" size={30} color="#F28B50" />
                        </View>

                        <Text style={styles.confirmTitle}>Submit Request</Text>
                        <Text style={styles.confirmDesc}>
                            Your request has been submitted to Riwayat Team
                        </Text>

                        <View style={styles.confirmActions}>
                            <Pressable style={styles.confirmCancelBtn} onPress={() => setSubmitModalVisible(false)}>
                                <Text style={styles.confirmCancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.confirmDoneBtn} onPress={() => {
                                setSubmitModalVisible(false);
                                router.back();
                            }}>
                                <Text style={styles.confirmDoneText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = RNStyleSheet.create({
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
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    infoText: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
        lineHeight: 20,
        marginBottom: 20,
        opacity: 0.8,
    },
    dayContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 10,
        overflow: 'hidden',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
    },
    dayHeaderOpen: {},
    dayTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: '#1A1A1A',
    },
    slotsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    slotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: 8,
        paddingHorizontal: 10,
    },
    slotInfo: {
        flex: 1,
        marginLeft: 10,
    },
    slotType: {
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: '#1A1A1A',
    },
    slotTime: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginRight: 10,
    },
    badgeActive: { backgroundColor: '#4CAF50' },
    badgeInactive: { backgroundColor: '#9E9E9E' },
    badgePending: { backgroundColor: '#FFA000' },

    statusText: {
        fontSize: 10,
        fontFamily: 'Poppins_500Medium',
        color: '#FFF',
        textTransform: 'capitalize',
    },
    textActive: { color: '#FFF' },
    textInactive: { color: '#FFF' },
    textPending: { color: '#FFF' },

    editIcon: {
        padding: 5,
    },

    submitBtn: {
        backgroundColor: '#4E0D0F', // Dark Red
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40,
    },
    submitBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        elevation: 5,
    },
    modalHeader: {
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    checkboxText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: '#1A1A1A',
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
        color: '#333',
        marginBottom: 8,
    },
    timeInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    timeText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 10,
        justifyContent: 'center',
    },
    modalCancelBtn: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#E8906C',
        minWidth: 100,
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#1A1A1A',
        fontFamily: 'Poppins_600SemiBold',
    },
    modalSubmitBtn: {
        backgroundColor: '#600E10',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        minWidth: 100,
        alignItems: 'center',
    },
    modalSubmitText: {
        color: '#FFF',
        fontFamily: 'Poppins_600SemiBold',
    },

    // Confirm Modal
    confirmModalContent: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
    },
    closeIcon: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    hourglassIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    confirmTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        marginBottom: 10,
        textAlign: 'center',
    },
    confirmDesc: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        textAlign: 'center',
        color: '#333',
        marginBottom: 25,
        lineHeight: 22,
    },
    confirmActions: {
        flexDirection: 'row',
        gap: 15,
    },
    confirmCancelBtn: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E8906C',
        minWidth: 110,
        alignItems: 'center',
    },
    confirmCancelText: {
        color: '#1A1A1A',
        fontFamily: 'Poppins_600SemiBold',
    },
    confirmDoneBtn: {
        backgroundColor: '#4E0D0F', // Dark Red
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        minWidth: 110,
        alignItems: 'center',
    },
    confirmDoneText: {
        color: '#FFF',
        fontFamily: 'Poppins_600SemiBold',
    },
});
