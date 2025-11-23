import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, IconButton, Divider, Portal, Dialog, Button } from 'react-native-paper';
import { colors, spacing } from '../theme/tokens';
import { PrimaryButton } from '../components/PrimaryButton';
import { SafetyBadge } from '../components/SafetyBadge';
import { useCartStore } from '../lib/stores/cartStore';
import { useUserStore } from '../lib/stores/userStore';
import { findBestAlternative } from '../modules/allergyEngine';

export const CartScreen = () => {
    const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getGroupedByAisle, getUnsafeItems, swapItem } = useCartStore();
    const { preferences } = useUserStore();
    const [showSwapDialog, setShowSwapDialog] = useState(false);

    // Debug logging
    console.log('CartScreen: Rendering with items:', items);
    console.log('CartScreen: Items count:', items.length);

    const groupedItems = getGroupedByAisle();
    const totalPrice = getTotalPrice();
    const unsafeItems = getUnsafeItems();
    const safeItemsCount = items.length - unsafeItems.length;

    // Get unique allergens from user preferences
    const allergenList = preferences.allergens.map(a => a.allergen);

    const handleSwapAllUnsafe = async () => {
        setShowSwapDialog(false);
        let swappedCount = 0;
        let failedCount = 0;

        for (const item of unsafeItems) {
            const alternative = findBestAlternative(item.productId, preferences);
            if (alternative) {
                swapItem(item.productId, {
                    productId: alternative.id,
                    name: alternative.name,
                    price: parseFloat(alternative.price.replace('$', '')),
                    aisle: alternative.aisle,
                    tokens: alternative.tokens,
                    safetyLevel: alternative.safetyLevel,
                });
                swappedCount++;
            } else {
                failedCount++;
            }
        }

        // Show result
        if (swappedCount > 0) {
            Alert.alert(
                'Success',
                `Swapped ${swappedCount} item${swappedCount > 1 ? 's' : ''} with safe alternatives${failedCount > 0 ? `. ${failedCount} item${failedCount > 1 ? 's' : ''} had no alternatives.` : '.'}`
            );
        } else {
            Alert.alert(
                'No Alternatives',
                'Could not find safe alternatives for any unsafe items.'
            );
        }
    };

    const renderCartItem = (item: any) => (
        <Card key={item.productId} style={styles.cartItem}>
            <Card.Content>
                <View style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                        <Text variant="titleMedium">{item.name}</Text>
                        <Text variant="bodySmall" style={styles.aisle}>
                            Aisle {item.aisle}
                        </Text>
                        <SafetyBadge level={item.safetyLevel} style={styles.badge} />
                    </View>

                    <View style={styles.itemActions}>
                        <View style={styles.quantityControl}>
                            <IconButton
                                icon="minus"
                                size={20}
                                onPress={() => {
                                    if (item.quantity > 1) {
                                        updateQuantity(item.productId, item.quantity - 1);
                                    } else {
                                        removeItem(item.productId);
                                    }
                                }}
                            />
                            <Text variant="titleMedium" style={styles.quantity}>
                                {item.quantity}
                            </Text>
                            <IconButton
                                icon="plus"
                                size={20}
                                onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                            />
                        </View>

                        <Text variant="titleMedium" style={styles.itemPrice}>
                            ${(item.price * item.quantity).toFixed(2)}
                        </Text>

                        <IconButton
                            icon="delete"
                            size={20}
                            onPress={() => removeItem(item.productId)}
                        />
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <IconButton icon="cart-outline" size={64} />
                <Text variant="headlineSmall" style={styles.emptyText}>
                    Your shopping list is empty
                </Text>
                <Text variant="bodyMedium" style={styles.emptySubtext}>
                    Add some products to get started!
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text variant="headlineMedium">Shopping List</Text>
                    <Text variant="bodyMedium" style={styles.itemCount}>
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                    </Text>
                </View>

                {/* Allergen Summary Card */}
                {allergenList.length > 0 && (
                    <Card style={styles.summaryCard}>
                        <Card.Content>
                            <View style={styles.summaryHeader}>
                                <IconButton icon="shield-check" size={24} iconColor={colors.primary} />
                                <Text variant="titleMedium" style={styles.summaryTitle}>
                                    Allergen Summary
                                </Text>
                            </View>
                            <View style={styles.summaryStats}>
                                <View style={styles.statRow}>
                                    <Text variant="bodyMedium">Safe items:</Text>
                                    <Text variant="bodyMedium" style={styles.statValue}>
                                        {safeItemsCount}
                                    </Text>
                                </View>
                                <View style={styles.statRow}>
                                    <Text variant="bodyMedium">Items to review:</Text>
                                    <Text variant="bodyMedium" style={[styles.statValue, styles.warningText]}>
                                        {unsafeItems.length}
                                    </Text>
                                </View>
                                <View style={styles.statRow}>
                                    <Text variant="bodyMedium">Allergens avoided:</Text>
                                    <Text variant="bodyMedium" style={styles.statValue}>
                                        {allergenList.join(', ')}
                                    </Text>
                                </View>
                            </View>
                            {unsafeItems.length > 0 && (
                                <PrimaryButton
                                    label={`Swap ${unsafeItems.length} Unsafe Item${unsafeItems.length > 1 ? 's' : ''}`}
                                    onPress={() => setShowSwapDialog(true)}
                                    mode="outlined"
                                    style={styles.swapAllButton}
                                />
                            )}
                        </Card.Content>
                    </Card>
                )}

                {Object.entries(groupedItems).map(([aisle, aisleItems]) => (
                    <View key={aisle} style={styles.aisleGroup}>
                        <Text variant="titleMedium" style={styles.aisleHeader}>
                            Aisle {aisle}
                        </Text>
                        {aisleItems.map(renderCartItem)}
                    </View>
                ))}

                <Divider style={styles.divider} />

                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text variant="titleLarge">Total</Text>
                        <Text variant="titleLarge" style={styles.totalPrice}>
                            ${totalPrice.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton
                    label="Clear List"
                    onPress={clearCart}
                    mode="outlined"
                    style={styles.clearButton}
                />
                <PrimaryButton
                    label="Checkout"
                    onPress={() => console.log('Proceed to checkout')}
                    mode="contained"
                    style={styles.checkoutButton}
                />
            </View>

            {/* Swap Confirmation Dialog */}
            <Portal>
                <Dialog visible={showSwapDialog} onDismiss={() => setShowSwapDialog(false)}>
                    <Dialog.Title>Swap Unsafe Items?</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            Replace {unsafeItems.length} unsafe item{unsafeItems.length > 1 ? 's' : ''} with safe alternatives?
                        </Text>
                        <Text variant="bodySmall" style={{ marginTop: spacing.sm, color: colors.onSurfaceVariant }}>
                            We'll find the best safe alternatives in the same categories.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowSwapDialog(false)}>Cancel</Button>
                        <Button onPress={handleSwapAllUnsafe}>Confirm</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: spacing.lg,
        paddingBottom: spacing.md,
    },
    itemCount: {
        color: colors.onSurfaceVariant,
        marginTop: spacing.xs,
    },
    aisleGroup: {
        marginBottom: spacing.lg,
    },
    aisleHeader: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surfaceVariant,
        fontWeight: 'bold',
    },
    cartItem: {
        marginHorizontal: spacing.lg,
        marginVertical: spacing.sm,
        backgroundColor: colors.surface,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemInfo: {
        flex: 1,
    },
    aisle: {
        color: colors.onSurfaceVariant,
        marginTop: spacing.xs,
    },
    badge: {
        marginTop: spacing.sm,
    },
    itemActions: {
        alignItems: 'flex-end',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    quantity: {
        marginHorizontal: spacing.sm,
        minWidth: 30,
        textAlign: 'center',
    },
    itemPrice: {
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    divider: {
        marginVertical: spacing.lg,
    },
    summary: {
        padding: spacing.lg,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalPrice: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        padding: spacing.lg,
        gap: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.outlineVariant,
        backgroundColor: colors.surface,
    },
    clearButton: {
        flex: 1,
    },
    checkoutButton: {
        flex: 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    emptySubtext: {
        color: colors.onSurfaceVariant,
    },
    summaryCard: {
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        backgroundColor: colors.surfaceVariant,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        marginLeft: -spacing.sm,
    },
    summaryTitle: {
        fontWeight: 'bold',
        color: colors.onSurface,
    },
    summaryStats: {
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statValue: {
        fontWeight: '600',
        color: colors.onSurface,
    },
    warningText: {
        color: colors.caution,
    },
    swapAllButton: {
        marginTop: spacing.sm,
    },
});
