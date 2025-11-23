import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, gradients } from '../theme/tokens';

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

    const buttonContent = (
        <Button
            mode={mode}
            onPress={handlePress}
            icon={icon}
            loading={loading}
            disabled={disabled}
            style={[
                styles.button,
                mode === 'outlined' && styles.outlined,
                // Remove background color for contained mode as we handle it with gradient
                mode === 'contained' && { backgroundColor: 'transparent' },
                style,
            ]}
            contentStyle={styles.content}
            labelStyle={[styles.label, labelStyle]}
            // Set transparent for contained to show gradient
            buttonColor={mode === 'contained' ? 'transparent' : undefined}
            textColor={mode === 'contained' ? colors.onPrimary : colors.primary}
        >
            {label}
        </Button>
    );

    if (mode === 'contained' && !disabled) {
        return (
            <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradientContainer, style]}
            >
                {buttonContent}
            </LinearGradient>
        );
    }

    return buttonContent;
};

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.round,
    },
    gradientContainer: {
        borderRadius: borderRadius.round,
        elevation: 2,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
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
