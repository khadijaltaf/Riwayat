import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    onDone: () => void;
    title: string;
    message: string;
    idLabel?: string;
    idValue?: string;
}

export default function ActionSuccessModal({ visible, onClose, onDone, title, message, idLabel, idValue }: SuccessModalProps) {
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Pressable style={styles.closeBtn} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#000" />
                    </Pressable>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {idLabel && idValue && (
                        <View style={styles.idContainer}>
                            <Text style={styles.idLabel}>{idLabel}</Text>
                            <Text style={styles.idValue}>{idValue}</Text>
                        </View>
                    )}

                    <View style={styles.btnRow}>
                        <Pressable style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </Pressable>
                        <Pressable style={styles.doneBtn} onPress={onDone}>
                            <Text style={styles.doneBtnText}>Done</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: '#FFF',
        borderRadius: 30,
        padding: 25,
        width: '100%',
        maxWidth: 350,
        alignItems: 'center',
        position: 'relative',
    },
    closeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 5,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#000',
        marginTop: 20,
        marginBottom: 15,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: '#4A4A4A',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 15,
    },
    idContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    idLabel: {
        fontSize: 15,
        fontFamily: 'Poppins_500Medium',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    idValue: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        color: '#000',
    },
    btnRow: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
    },
    cancelBtn: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#FFD180',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#000',
    },
    doneBtn: {
        flex: 1.2,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#600E10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    doneBtnText: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#FFF',
    },
});
