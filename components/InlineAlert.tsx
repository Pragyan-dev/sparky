import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme/tokens';

interface InlineAlertProps {
    title: string;
    message?: string;
    type?: 'info' | 'warning' | 'error' | 'success';
}

export const InlineAlert: React.FC<InlineAlertProps> = ({
    title,
    message,
    type = 'info',
}) => {
    const getColors = () => {
        switch (type) {
            case 'info':
                return {
                    bg: colors.secondaryContainer,
                    text: colors.onSecondaryContainer,
                    icon: 'information',
                    iconColor: colors.secondary,
                };
            case 'warning':
                return {
                    bg: colors.cautionContainer,
                    text: colors.onCaution,
                    icon: 'alert',
                    iconColor: colors.caution, // Using caution color directly
                };
            case 'error':
                return {
                    bg: colors.criticalContainer,
                    text: colors.onCritical, // Wait, criticalContainer text is usually onCriticalContainer? 
                    // Let's use critical color for text on container for better contrast if needed, 
                    // but Material 3 uses onContainer.
                    // In our tokens we have onCritical (white) and critical (red).
                    // criticalContainer background is light red.
                    // So text should be onCriticalContainer (dark red).
                    // But we don't have onCriticalContainer in tokens.ts!
                    // We have onPrimaryContainer, onSecondaryContainer, onTertiaryContainer.
                    // We do NOT have onCriticalContainer or onCautionContainer or onSuccessContainer.
                    // So we should use the base color for text (e.g. critical) or onSurface.
                    icon: 'alert-circle',
                    iconColor: colors.critical,
                };
            case 'success':
                return {
                    bg: colors.successContainer,
                    text: colors.onSurface, // Fallback
                    icon: 'check-circle',
                    iconColor: colors.success,
                };
        }
    };

    const themeColors = getColors();

    // Fix text colors since we lack specific onContainer tokens for semantic colors
    const textColor = type === 'info' ? colors.onSecondaryContainer : colors.onSurface;

    return (
        <View style={[styles.container, { backgroundColor: themeColors.bg }]}>
            <MaterialCommunityIcons
                name={themeColors.icon as any}
                size={24}
                color={themeColors.iconColor}
                style={styles.icon}
            />
            <View style={styles.content}>
                <Text style={[styles.title, { color: textColor }]}>{title}</Text>
                {message && (
                    <Text style={[styles.message, { color: textColor }]}>{message}</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginVertical: spacing.sm,
    },
    icon: {
        marginRight: spacing.md,
    },
    content: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
    },
    message: {
        fontSize: 12,
        opacity: 0.8,
    },
});
