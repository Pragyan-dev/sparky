import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius } from '../theme/tokens';

interface PrimaryButtonProps {
    label: string;
    onPress: () => void;
    mode?: 'contained' | 'outlined' | 'text';
    icon?: string;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    labelStyle?: TextStyle;
    haptic?: 'light' | 'medium' | 'heavy' | 'none';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    label,
    onPress,
    mode = 'contained',
    icon,
    loading = false,
    disabled = false,
    style,
    labelStyle,
    haptic = 'light',
}) => {
    const handlePress = () => {
        if (haptic !== 'none') {
            switch (haptic) {
                case 'light':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    break;
                case 'medium':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    break;
                case 'heavy':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    break;
            }
        }
        onPress();
    };

    return (
        <Button
            mode={mode}
            onPress={handlePress}
            icon={icon}
            loading={loading}
            disabled={disabled}
            style={[
                styles.button,
                mode === 'contained' && styles.contained,
                mode === 'outlined' && styles.outlined,
                style,
            ]}
            contentStyle={styles.content}
            labelStyle={[styles.label, labelStyle]}
            buttonColor={mode === 'contained' ? colors.primary : undefined}
            textColor={mode === 'contained' ? colors.onPrimary : colors.primary}
        >
            {label}
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.round,
    },
    contained: {
        elevation: 2,
    },
    outlined: {
        borderColor: colors.outline,
    },
    content: {
        height: 48,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
