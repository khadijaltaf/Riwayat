import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    secureTextEntry?: boolean;
    autoFocus?: boolean;
}

export default function OTPInput({
    length = 4,
    value,
    onChange,
    secureTextEntry = false,
    autoFocus = true,
}: OTPInputProps) {
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);

    // Split value into array of digits
    const digits = value.split('').slice(0, length);
    while (digits.length < length) {
        digits.push('');
    }

    const handleChangeText = (text: string, index: number) => {
        // Handle paste
        if (text.length > 1) {
            const pastedDigits = text.replace(/\D/g, '').slice(0, length);
            onChange(pastedDigits);

            // Focus the last filled box or the next empty one
            const nextIndex = Math.min(pastedDigits.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        // Handle single digit input
        const digit = text.replace(/\D/g, '');
        const newDigits = [...digits];
        newDigits[index] = digit;
        onChange(newDigits.join(''));

        // Auto-focus next input
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Handle backspace
        if (e.nativeEvent.key === 'Backspace') {
            if (!digits[index] && index > 0) {
                // If current box is empty, move to previous box
                inputRefs.current[index - 1]?.focus();

                // Clear the previous box
                const newDigits = [...digits];
                newDigits[index - 1] = '';
                onChange(newDigits.join(''));
            } else if (digits[index]) {
                // Clear current box
                const newDigits = [...digits];
                newDigits[index] = '';
                onChange(newDigits.join(''));
            }
        }
    };

    const handleFocus = (index: number) => {
        setFocusedIndex(index);
    };

    const handleBlur = () => {
        setFocusedIndex(null);
    };

    return (
        <View style={styles.container}>
            {digits.map((digit, index) => (
                <Pressable
                    key={index}
                    onPress={() => inputRefs.current[index]?.focus()}
                    style={styles.boxWrapper}
                >
                    <TextInput
                        ref={(ref) => {
                            inputRefs.current[index] = ref;
                        }}
                        style={[
                            styles.box,
                            focusedIndex === index && styles.boxFocused,
                            digit && styles.boxFilled,
                        ]}
                        value={digit}
                        onChangeText={(text) => handleChangeText(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        onFocus={() => handleFocus(index)}
                        onBlur={handleBlur}
                        keyboardType="number-pad"
                        maxLength={1}
                        secureTextEntry={secureTextEntry}
                        autoFocus={autoFocus && index === 0}
                        selectTextOnFocus
                        textAlign="center"
                    />
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    boxWrapper: {
        flex: 1,
    },
    box: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#1A1A1A',
        paddingVertical: 16,
        paddingHorizontal: 8,
        textAlign: 'center',
    },
    boxFocused: {
        borderColor: '#600E10',
        backgroundColor: '#FFF8F7',
    },
    boxFilled: {
        borderColor: '#E8906C',
        backgroundColor: '#FFFFFF',
    },
});
