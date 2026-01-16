
import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Modal, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectionBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    items: string[];
    onSelect: (item: string) => void;
    placeholder?: string;
}

const { height, width } = Dimensions.get('window');

export default function SelectionBottomSheet({
    visible,
    onClose,
    items,
    onSelect,
    placeholder = 'Search'
}: SelectionBottomSheetProps) {
    const [search, setSearch] = useState('');

    const filteredItems = items.filter(item =>
        item.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.dismissArea} onPress={onClose} />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.sheetContainer}
                >
                    <View style={styles.indicator} />

                    <View style={styles.searchSection}>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder={placeholder}
                                value={search}
                                onChangeText={setSearch}
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                        {filteredItems.map((item, index) => (
                            <Pressable
                                key={index}
                                style={styles.item}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <Text style={styles.itemText}>{item}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    sheetContainer: {
        height: height * 0.45,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 12,
    },
    indicator: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    searchSection: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#000',
    },
    list: {
        flex: 1,
    },
    item: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    itemText: {
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        color: '#1A1A1A',
    },
});
