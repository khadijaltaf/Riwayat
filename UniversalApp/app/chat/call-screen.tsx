
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function CallScreen() {
    const router = useRouter();
    const { name } = useLocalSearchParams();
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.content}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={50} color="#600E10" />
                </View>
                <Text style={styles.name}>{name || 'Unknown'}</Text>
                <Text style={styles.status}>Ringing...</Text>
                <Text style={styles.timer}>{formatTime(duration)}</Text>
            </View>

            <View style={styles.controls}>
                <Pressable style={[styles.controlBtn, styles.muteBtn]}>
                    <Ionicons name="mic-off" size={28} color="#FFF" />
                </Pressable>
                <Pressable style={[styles.controlBtn, styles.endBtn]} onPress={() => router.back()}>
                    <Ionicons name="call" size={32} color="#FFF" />
                </Pressable>
                <Pressable style={[styles.controlBtn, styles.speakerBtn]}>
                    <Ionicons name="volume-high" size={28} color="#FFF" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A', // Dark theme call
        justifyContent: 'space-between',
        paddingVertical: 80,
    },
    content: {
        alignItems: 'center',
        marginTop: 50,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    status: {
        fontSize: 18,
        color: '#CCC',
        marginBottom: 10,
    },
    timer: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: '300',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    controlBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    muteBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    speakerBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    endBtn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#D32F2F',
    },
});
