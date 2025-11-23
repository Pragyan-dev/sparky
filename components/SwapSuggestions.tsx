import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../theme/tokens';
import { ProductCardPro } from './ProductCardPro';
import { PrimaryButton } from './PrimaryButton';
import { AlternativeProduct } from '../modules/allergyEngine';
import { useCartStore } from '../lib/stores/cartStore';
import * as Haptics from 'expo-haptics';

interface SwapSuggestionsProps {
    alternatives: AlternativeProduct[];
    originalProductId: string;
    onSwap?: (alternativeId: string) => void;
}

export const SwapSuggestions: React.FC<SwapSuggestionsProps> = ({
    alternatives,
    originalProductId,
    onSwap,
}) => {
    const navigation = useNavigation();
    const { swapItem, items } = useCartStore();

    const handleSwap = (alternative: AlternativeProduct) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Check if original product is in cart
        const isInCart = items.some(item => item.productId === originalProductId);

        if (isInCart) {
            // Swap in cart
            swapItem(originalProductId, {
                productId: alternative.id,
                name: alternative.name,
                price: parseFloat(alternative.price.replace('$', '')),
                aisle: alternative.aisle,
                tokens: alternative.tokens,
                safetyLevel: alternative.safetyLevel,
            });
        }

        // Call optional callback
        if (onSwap) {
            onSwap(alternative.id);
        }

        // Navigate back or to the alternative product
        navigation.goBack();
    };

    if (alternatives.length === 0) {
        return (
            <Card style={styles.emptyCard}>
                <Card.Content>
                    <View style={styles.emptyContent}>
                        <IconButton icon="swap-horizontal" size={48} iconColor={colors.onSurfaceVariant} />
                        <Text variant="titleMedium" style={styles.emptyTitle}>
                            No safe alternatives found
                        </Text>
                        <Text variant="bodyMedium" style={styles.emptyText}>
                            Try browsing other categories for similar products that match your dietary needs.
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="swap-horizontal" size={24} iconColor={colors.primary} />
                <Text variant="titleLarge" style={styles.title}>
                    Safe Alternatives
                </Text>
            </View>
            <Text variant="bodyMedium" style={styles.subtitle}>
                We found {alternatives.length} safe {alternatives.length === 1 ? 'alternative' : 'alternatives'} in the same category
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                {alternatives.map((alternative) => (
                    <View key={alternative.id} style={styles.alternativeCard}>
                        <ProductCardPro
                            productId={alternative.id}
                            name={alternative.name}
                            price={alternative.price}
                            imageUri={alternative.imageUri}
                            safetyLevel={alternative.safetyLevel}
                            onPress={() => {
                                // Navigate to alternative product detail
                                (navigation as any).replace('ProductDetail', { productId: alternative.id });
                            }}
                        />
                        <View style={styles.swapButtonContainer}>
                            {alternative.priceDifference !== 0 && (
                                <Text
                                    variant="bodySmall"
                                    style={[
                                        styles.priceDiff,
                                        alternative.priceDifference > 0 ? styles.priceDiffHigher : styles.priceDiffLower
                                    ]}
                                >
                                    {alternative.priceDifference > 0 ? '+' : ''}
                                    ${Math.abs(alternative.priceDifference).toFixed(2)}
                                </Text>
                            )}
                            <PrimaryButton
                                label="Swap"
                                onPress={() => handleSwap(alternative)}
                                mode="contained"
                                style={styles.swapButton}
                            />
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    title: {
        fontWeight: 'bold',
        color: colors.onSurface,
        marginLeft: spacing.xs,
    },
    subtitle: {
        color: colors.onSurfaceVariant,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.xs,
    },
    scrollView: {
        marginHorizontal: -spacing.lg,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    alternativeCard: {
        width: 200,
        marginRight: spacing.md,
    },
    swapButtonContainer: {
        marginTop: spacing.sm,
        alignItems: 'center',
    },
    priceDiff: {
        fontSize: 12,
        marginBottom: spacing.xs,
        fontWeight: '600',
    },
    priceDiffHigher: {
        color: colors.critical,
    },
    priceDiffLower: {
        color: colors.success,
    },
    swapButton: {
        width: '100%',
    },
    emptyCard: {
        marginVertical: spacing.md,
        backgroundColor: colors.surfaceVariant,
    },
    emptyContent: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    emptyTitle: {
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
        color: colors.onSurfaceVariant,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.onSurfaceVariant,
        paddingHorizontal: spacing.md,
    },
});
