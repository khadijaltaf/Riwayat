import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RaiseCaseScreen() {
    const router = useRouter();
    const [caseType, setCaseType] = useState('');
    const [subType, setSubType] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock Dropdown Options
    const [modalVisible, setModalVisible] = useState(false);
    const [pickerField, setPickerField] = useState<'type' | 'subtype' | null>(null);

    const types = ['Payment Issue', 'Order Dispute', 'Account Issue', 'Other'];
    const subTypes = ['Wrong Amount', 'Delayed Payment', 'Refund Request'];

    const handleSelect = (item: string) => {
        if (pickerField === 'type') setCaseType(item);
        if (pickerField === 'subtype') setSubType(item);
        setModalVisible(false);
    };

    const handleSubmit = () => {
        if (!caseType || !subType) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.back();
            alert('Case Submitted Successfully');
        }, 1200);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#600E10" />
                </Pressable>
                <Text style={styles.headerTitle}>Raise Case</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Case Type */}
                <Text style={styles.label}>case type</Text>
                <Pressable style={styles.dropdown} onPress={() => { setPickerField('type'); setModalVisible(true); }}>
                    <Text style={[styles.dropdownText, !caseType && styles.placeholderText]}>
                        {caseType || '--Select Type--'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#999" />
                </Pressable>

                {/* Case Sub Type */}
                <Text style={styles.label}>case sub type</Text>
                <Pressable style={styles.dropdown} onPress={() => { setPickerField('subtype'); setModalVisible(true); }}>
                    <Text style={[styles.dropdownText, !subType && styles.placeholderText]}>
                        {subType || '--Select Type--'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#999" />
                </Pressable>

                {/* Attachments */}
                <Text style={styles.label}>Attachments</Text>
                <Pressable style={styles.uploadBox}>
                    <Ionicons name="cloud-upload-outline" size={32} color="#999" />
                    <Text style={styles.uploadText}>Click to upload images or documents</Text>
                    <Text style={styles.uploadSubText}>Max 5 files, 10MB each</Text>
                </Pressable>

            </ScrollView>

            {/* Footer Submit */}
            <View style={styles.footer}>
                <Pressable style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit'}</Text>
                </Pressable>
            </View>

            {/* Simple Selection Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Option</Text>
                        {(pickerField === 'type' ? types : subTypes).map((item) => (
                            <Pressable key={item} style={styles.modalItem} onPress={() => handleSelect(item)}>
                                <Text style={styles.modalItemText}>{item}</Text>
                            </Pressable>
                        ))}
                        <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F8FF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#600E10',
    },
    content: {
        padding: 24,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    dropdown: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    dropdownText: {
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
    },
    placeholderText: {
        color: '#999',
    },
    uploadBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: '#666',
        marginTop: 12,
    },
    uploadSubText: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#999',
        marginTop: 4,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    },
    submitButton: {
        backgroundColor: '#600E10',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    submitText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalItemText: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: '#1A1A1A',
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 16,
        alignItems: 'center',
        padding: 12,
    },
    closeText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#600E10',
    },
});
