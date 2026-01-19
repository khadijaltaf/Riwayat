
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Modal, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function KitchenAddressScreen() {
    const router = useRouter();

    const [deliveryInstructions, setDeliveryInstructions] = useState("abc");
    const [submitModalVisible, setSubmitModalVisible] = useState(false);

    // Read-only values from screenshot
    const addressName = "Abc";
    const fullAddress = "123 MG Road, Bangalore - 560001";
    const city = "Sadia Ariba"; // This looks like a name selected in a city dropdown? Use as string for now.
    const cityZone = "Abc";
    const googleMapLink = "abc";

    const handleConfirm = () => {
        Keyboard.dismiss();
        setSubmitModalVisible(true);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#600E10" />
                </Pressable>
                <Text style={styles.headerTitle}>Kitchen Address</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* Disabled Fields */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Address Name</Text>
                    <View style={styles.disabledInput}>
                        <Text style={styles.disabledText}>{addressName}</Text>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Full Address</Text>
                    <View style={styles.disabledInput}>
                        <Text style={styles.disabledText}>{fullAddress}</Text>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>City</Text>
                    <View style={styles.disabledInput}>
                        <Text style={styles.disabledText}>{city}</Text>
                        <Ionicons name="chevron-down" size={20} color="#999" style={{ position: 'absolute', right: 15, top: 15 }} />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>City Zone</Text>
                    <View style={styles.disabledInput}>
                        <Text style={styles.disabledText}>{cityZone}</Text>
                        <Ionicons name="chevron-down" size={20} color="#999" style={{ position: 'absolute', right: 15, top: 15 }} />
                    </View>
                </View>

                {/* Editable Field */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Delivery Instructions & Nearest Landmark</Text>
                    <TextInput
                        style={styles.input}
                        value={deliveryInstructions}
                        onChangeText={setDeliveryInstructions}
                    />
                </View>

                {/* Disabled Map Link */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Google Map Location Link</Text>
                    <View style={styles.disabledInput}>
                        <Text style={styles.disabledText}>{googleMapLink}</Text>
                    </View>
                </View>

                {/* Live Map Preview */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Live Map Preview</Text>
                    <View style={styles.mapContainer}>
                        <View style={styles.pinCircle}>
                            <Ionicons name="location-outline" size={20} color="#000" />
                        </View>
                        <Text style={styles.mapHelperText}>Add Google Maps link to view location</Text>
                    </View>
                </View>

                <Pressable style={styles.saveBtn} onPress={handleConfirm}>
                    <Text style={styles.saveText}>Confirm</Text>
                </Pressable>

            </ScrollView>

            {/* Submit Request Modal */}
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

                        <Text style={styles.modalTitle}>Submit Request</Text>
                        <Text style={styles.modalDesc}>
                            Your request has been submitted to Riwayat Team
                        </Text>

                        <View style={styles.modalActions}>
                            <Pressable style={styles.modalCancelBtn} onPress={() => setSubmitModalVisible(false)}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.modalConfirmBtn} onPress={() => {
                                setSubmitModalVisible(false);
                                router.back();
                            }}>
                                <Text style={styles.modalConfirmText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

        </KeyboardAvoidingView>
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
    content: {
        padding: 24,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    disabledInput: {
        backgroundColor: '#D1D5DB', // Grey background
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        minHeight: 56,
    },
    disabledText: {
        color: '#6B7280', // Grey text
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
    },
    mapContainer: {
        height: 150,
        backgroundColor: '#D1D5DB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    pinCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    mapHelperText: {
        fontSize: 12,
        color: '#555',
        fontFamily: 'Poppins_400Regular',
        textAlign: 'center',
        maxWidth: 200,
    },
    saveBtn: {
        backgroundColor: '#4E0D0F', // Dark Red
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    saveText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmModalContent: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
    },
    closeIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    hourglassIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#000',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalDesc: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
        justifyContent: 'center',
    },
    modalCancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E8906C',
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#000',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
    },
    modalConfirmBtn: {
        flex: 1,
        backgroundColor: '#4E0D0F', // Dark Red
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
    },
    modalConfirmText: {
        color: '#FFF',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
    },
});
