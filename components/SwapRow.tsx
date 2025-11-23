import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../theme/tokens';

interface SwapRowProps {
    left: React.ReactNode;
    right: React.ReactNode;
    onSwap?: () => void;
}

export const SwapRow: React.FC<SwapRowProps> = ({ left, right, onSwap }) => {
    return (
        <View style={styles.container}>
            <View style={styles.item}>{left}</View>
            <IconButton
                icon="swap-horizontal"
                size={24}
                onPress={onSwap}
                style={styles.swapButton}
            />
            <View style={styles.item}>{right}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
    },
    item: {
        flex: 1,
        marginHorizontal: spacing.xs,
    },
    swapButton: {
        marginHorizontal: spacing.xs,
    },
});
