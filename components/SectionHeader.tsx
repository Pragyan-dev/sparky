import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, typography } from '../theme/tokens';

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    actionLabel,
    onAction,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {actionLabel && onAction && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={styles.action}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        marginTop: spacing.sm,
    },
    title: {
        ...typography.titleLarge,
        color: colors.onSurface,
        fontWeight: 'bold',
    },
    action: {
        ...typography.labelLarge,
        color: colors.primary,
        fontWeight: '600',
    },
});
