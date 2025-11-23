import React from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { Text, IconButton, Divider, Chip } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../theme/tokens';
import { ConflictResult } from '../modules/allergyEngine';
import { PrimaryButton } from './PrimaryButton';

interface WhyFlaggedSheetProps {
    visible: boolean;
    onDismiss: () => void;
    conflictResult: ConflictResult;
    ingredients: string[];
}

export const WhyFlaggedSheet: React.FC<WhyFlaggedSheetProps> = ({
    visible,
    onDismiss,
    conflictResult,
    ingredients,
}) => {
    const getSeverityInfo = () => {
        if (conflictResult.level === 'hardstop') {
            return {
                title: '⛔ Contains Hardstop Allergen',
                color: colors.critical,
                backgroundColor: colors.criticalContainer,
                description: 'This product contains allergens you marked as "hardstop". We strongly recommend avoiding this product.',
            };
        } else if (conflictResult.level === 'caution') {
            return {
                title: '🟠 Contains Ingredients to Avoid',
                color: colors.caution,
                backgroundColor: colors.cautionContainer,
                description: 'This product contains ingredients you prefer to avoid. Review the details below before purchasing.',
            };
        }
        return {
            title: '✅ Safe Product',
            color: colors.success,
            backgroundColor: colors.successContainer,
            description: 'This product does not contain any of your allergens or restricted ingredients.',
        };
    };

    const severityInfo = getSeverityInfo();

    // Find which ingredients contain the allergens
    const flaggedIngredients = ingredients.filter(ingredient =>
        conflictResult.matches.some(match =>
            ingredient.toLowerCase().includes(match.toLowerCase())
        )
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.dragHandle} />
                        <IconButton
                            icon="close"
                            size={24}
                            onPress={onDismiss}
                            style={styles.closeButton}
                        />
                    </View>

                    <ScrollView style={styles.content}>
                        {/* Title Card */}
                        <View style={[styles.titleCard, { backgroundColor: severityInfo.backgroundColor }]}>
                            <Text variant="headlineSmall" style={[styles.title, { color: severityInfo.color }]}>
                                {severityInfo.title}
                            </Text>
                            <Text variant="bodyMedium" style={styles.description}>
                                {severityInfo.description}
                            </Text>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Matched Allergens */}
                        {conflictResult.matches.length > 0 && (
                            <View style={styles.section}>
                                <Text variant="titleMedium" style={styles.sectionTitle}>
                                    Detected Allergens
                                </Text>
                                <View style={styles.chipContainer}>
                                    {conflictResult.matches.map((match, index) => (
                                        <Chip
                                            key={index}
                                            mode="flat"
                                            style={[styles.chip, { backgroundColor: severityInfo.backgroundColor }]}
                                            textStyle={{ color: severityInfo.color, fontWeight: '600' }}
                                        >
                                            {match}
                                        </Chip>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Flagged Ingredients */}
                        {flaggedIngredients.length > 0 && (
                            <>
                                <Divider style={styles.divider} />
                                <View style={styles.section}>
                                    <Text variant="titleMedium" style={styles.sectionTitle}>
                                        Ingredients Containing Allergens
                                    </Text>
                                    <View style={styles.ingredientList}>
                                        {flaggedIngredients.map((ingredient, index) => (
                                            <View key={index} style={styles.ingredientRow}>
                                                <IconButton
                                                    icon="alert-circle"
                                                    size={20}
                                                    iconColor={severityInfo.color}
                                                />
                                                <Text variant="bodyMedium" style={styles.ingredientText}>
                                                    {ingredient}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </>
                        )}

                        {/* Educational Note */}
                        <Divider style={styles.divider} />
                        <View style={styles.section}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>
                                Important Note
                            </Text>
                            <Text variant="bodySmall" style={styles.noteText}>
                                Always check product labels for the most up-to-date ingredient information.
                                Cross-contamination may occur during manufacturing. If you have severe allergies,
                                consult with the manufacturer directly.
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <PrimaryButton
                            label="Got it"
                            onPress={onDismiss}
                            mode="contained"
                            style={styles.button}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        alignItems: 'center',
        paddingTop: spacing.md,
        paddingHorizontal: spacing.lg,
        position: 'relative',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.outlineVariant,
        borderRadius: 2,
        marginBottom: spacing.sm,
    },
    closeButton: {
        position: 'absolute',
        right: spacing.sm,
        top: spacing.sm,
    },
    content: {
        paddingHorizontal: spacing.lg,
    },
    titleCard: {
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: spacing.sm,
    },
    description: {
        color: colors.onSurface,
        lineHeight: 20,
    },
    divider: {
        marginVertical: spacing.md,
    },
    section: {
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: spacing.sm,
        color: colors.onSurface,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        marginVertical: spacing.xs,
    },
    ingredientList: {
        gap: spacing.xs,
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -spacing.sm,
    },
    ingredientText: {
        flex: 1,
        color: colors.onSurface,
    },
    noteText: {
        color: colors.onSurfaceVariant,
        lineHeight: 18,
        fontStyle: 'italic',
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.outlineVariant,
    },
    button: {
        width: '100%',
    },
});
