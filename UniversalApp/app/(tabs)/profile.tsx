
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Profile Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4FAFF' },
    text: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: '#5C1414' }
});
