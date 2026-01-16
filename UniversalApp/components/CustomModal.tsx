
import React from 'react';
import { StyleSheet, View, Text, Pressable, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onAccept: () => void;
    onReject: () => void;
    acceptLabel?: string;
    rejectLabel?: string;
}

const { width } = Dimensions.get('window');

export default function CustomModal({
    visible,
    onClose,
    title,
    message,
    onAccept,
    onReject,
    acceptLabel = 'Accept',
    rejectLabel = 'Reject'
}: CustomModalProps) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={20} color="#000" />
                    </Pressable>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonRow}>
                        <Pressable style={styles.rejectButton} onPress={onReject}>
                            <Text style={styles.rejectButtonText}>{rejectLabel}</Text>
                        </Pressable>
                        <Pressable style={styles.acceptButton} onPress={onAccept}>
                            <Text style={styles.acceptButtonText}>{acceptLabel}</Text>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.88,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 24,
        alignItems: 'center',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#000000',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    message: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 35,
        paddingHorizontal: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
        paddingHorizontal: 5,
    },
    rejectButton: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#E8906C',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    rejectButtonText: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#000000',
    },
    acceptButton: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#5C1414',
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptButtonText: {
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        color: '#FFFFFF',
    },
});
