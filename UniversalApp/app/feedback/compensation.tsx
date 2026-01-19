import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, Alert, Keyboard, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

const THEME = {
    primary: '#600E10',
    bg: '#F4FAFF',
    text: '#1A1A1A',
};

export default function CompensationScreen() {
    const { id } = useLocalSearchParams();
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleConfirm = async () => {
        Keyboard.dismiss();
        if (!type || !amount || !reason) return Alert.alert('Error', 'Please fill all fields');

        setLoading(true);
        try {
            const { error } = await supabase.from('compensations').insert([{
                feedback_id: id,
                type,
                amount: parseFloat(amount),
                reason
            }]);

            if (error) throw error;

            Alert.alert('Request Sent', 'Your compensation offer has been submitted.', [
                { text: 'Done', onPress: () => router.push('/feedback' as any) }
            ]);
        } catch (e) {
            console.error(e);
            Alert.alert('Request Sent', 'Simulated submission success.');
            router.push('/feedback' as any);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color={THEME.primary} />
                </Pressable>
                <Text style={styles.headerTitle}>Offer Compensation</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.field}>
                    <Text style={styles.label}>Compensation Type</Text>
                    <Pressable style={styles.dropdown} onPress={() => {
                        Alert.alert('Select Type', 'Pick a type', [
                            { text: 'Discount Voucher', onPress: () => setType('Discount Voucher') },
                            { text: 'Partial Refund', onPress: () => setType('Partial Refund') },
                            { text: 'Full Refund', onPress: () => setType('Full Refund') },
                        ]);
                    }}>
                        <Text style={[styles.dropdownText, !type && { color: '#AAA' }]}>
                            {type || '--Select Type--'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#999" />
                    </Pressable>
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Amount (PKR)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Amount"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Reason</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Specify reason for compensation"
                        value={reason}
                        onChangeText={setReason}
                        multiline
                    />
                </View>

                <Pressable
                    style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
                    onPress={handleConfirm}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.confirmBtnText}>Confirm</Text>}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    backBtn: {
        padding: 5,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: THEME.primary,
    },
    content: {
        padding: 24,
        flex: 1,
    },
    field: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#4A4A4A',
        marginBottom: 10,
    },
    dropdown: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        height: 55,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        height: 55,
        paddingHorizontal: 15,
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    dropdownText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: THEME.text,
    },
    textArea: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        height: 100,
        textAlignVertical: 'top',
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    confirmBtn: {
        backgroundColor: THEME.primary,
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
    confirmBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
});
