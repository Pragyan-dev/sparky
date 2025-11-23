import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { colors, spacing } from '../theme/tokens';

interface IngredientChipProps {
    name: string;
    isAllergen?: boolean;
    isAvoided?: boolean;
    onPress?: () => void;
}

export const IngredientChip: React.FC<IngredientChipProps> = ({
    name,
    isAllergen = false,
    isAvoided = false,
    onPress,
}) => {
    const isUnsafe = isAllergen || isAvoided;

    return (
        <Chip
            mode="flat"
            onPress={onPress}
            style={[
                styles.chip,
                isUnsafe ? styles.unsafeChip : styles.safeChip,
            ]}
            textStyle={[
                styles.text,
                isUnsafe ? styles.unsafeText : styles.safeText,
            ]}
            icon={isUnsafe ? 'alert-circle-outline' : undefined}
        >
            {name}
        </Chip>
    );
};

const styles = StyleSheet.create({
    chip: {
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
        borderRadius: 8,
    },
    safeChip: {
        backgroundColor: colors.surfaceVariant,
    },
    unsafeChip: {
        backgroundColor: colors.criticalContainer,
    },
    text: {
        fontSize: 12,
    },
    safeText: {
        color: colors.onSurfaceVariant,
    },
    unsafeText: {
        color: colors.critical,
        fontWeight: 'bold',
    },
});
