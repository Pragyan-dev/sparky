import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { colors, spacing, borderRadius, elevation } from '../theme/tokens';

interface FloatingActionBarProps {
    primaryLabel: string;
    onPrimaryPress: () => void;
    secondaryLabel?: string;
    onSecondaryPress?: () => void;
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
    primaryLabel,
    onPrimaryPress,
    secondaryLabel,
    onSecondaryPress,
}) => {
    return (
        <View style={styles.container}>
            {secondaryLabel && onSecondaryPress && (
                <PrimaryButton
                    label={secondaryLabel}
                    onPress={onSecondaryPress}
                    mode="outlined"
                    style={styles.secondaryButton}
                />
            )}
            <PrimaryButton
                label={primaryLabel}
                onPress={onPrimaryPress}
                mode="contained"
                style={styles.primaryButton}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: spacing.lg,
        left: spacing.lg,
        right: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        ...elevation.level3,
    },
    primaryButton: {
        marginLeft: spacing.sm,
    },
    secondaryButton: {
        marginRight: spacing.sm,
    },
});
