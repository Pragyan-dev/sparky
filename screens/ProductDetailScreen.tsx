import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Divider, IconButton, Card, Button } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { products } from '../data/products';
import productsData from '../data/products.json';
import { IngredientChip } from '../components/IngredientChip';
import { SectionHeader } from '../components/SectionHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SafetyBadge } from '../components/SafetyBadge';
import { SwapSuggestions } from '../components/SwapSuggestions';
import { WhyFlaggedSheet } from '../components/WhyFlaggedSheet';
import { colors, spacing } from '../theme/tokens';
import { useCartStore } from '../lib/stores/cartStore';
import { useUserStore } from '../lib/stores/userStore';
import { checkConflicts, findSafeAlternatives, AlternativeProduct } from '../modules/allergyEngine';

type RootStackParamList = {
    ProductDetail: { productId: string };
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen = () => {
    const route = useRoute<ProductDetailRouteProp>();
    const { productId } = route.params;
    const { addItem } = useCartStore();
    const { preferences } = useUserStore();

    const [showWhyFlagged, setShowWhyFlagged] = useState(false);
    const [alternatives, setAlternatives] = useState<AlternativeProduct[]>([]);

    const product = products.find(p => p.id === productId);
    const rawProduct = (productsData as any).products.find((p: any) => p.id === productId);

    if (!product) {
        return (
            <View style={styles.container}>
                <Text>Product not found</Text>
            </View>
        );
    }

    // Calculate actual safety level using allergy engine
    const tokens = rawProduct?.tokens || [];
    const conflictResult = checkConflicts(preferences, tokens);
    const actualSafetyLevel = conflictResult.level;

    // Find safe alternatives when product is unsafe
    useEffect(() => {
        if (actualSafetyLevel !== 'safe') {
            const safeAlternatives = findSafeAlternatives(productId, preferences, 3);
            setAlternatives(safeAlternatives);
        } else {
            setAlternatives([]);
        }
    }, [productId, actualSafetyLevel, preferences]);

    const handleAddToCart = () => {
        console.log('=== ADD TO CART START ===');
        console.log('Product ID:', product.id);
        console.log('Product Name:', product.name);
        console.log('Product Price:', product.price);
        console.log('Raw Product:', rawProduct);
        console.log('Tokens:', tokens);
        console.log('Safety Level:', actualSafetyLevel);

        // Add haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const cartItem = {
            productId: product.id,
            name: product.name,
            price: parseFloat(product.price.replace('$', '')),
            aisle: rawProduct?.aisle || 'A1',
            tokens: tokens,
            safetyLevel: actualSafetyLevel,
        };

        console.log('Cart Item to add:', JSON.stringify(cartItem));
        console.log('About to call addItem...');
        console.log('addItem function:', addItem);

        addItem(cartItem);

        console.log('=== ADD TO CART END ===');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
                {product.imageUri ? (
                    <Image source={{ uri: product.imageUri }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <IconButton icon="image-outline" size={64} />
                        <Text variant="bodySmall">No image available</Text>
                    </View>
                )}
            </View>

            {/* Product Info */}
            <View style={styles.infoContainer}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text variant="headlineMedium" style={styles.productName}>
                            {product.name}
                        </Text>
                        <SafetyBadge level={actualSafetyLevel} />
                    </View>
                    <Text variant="headlineSmall" style={styles.price}>
                        {product.price}
                    </Text>
                    {rawProduct?.brand && (
                        <Text variant="bodyMedium" style={styles.brand}>
                            by {rawProduct.brand}
                        </Text>
                    )}
                </View>

                {/* Safety Alert */}
                {actualSafetyLevel !== 'safe' && (
                    <Card style={styles.alertCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.alertTitle}>
                                ⚠️ {conflictResult.reason}
                            </Text>
                            {conflictResult.matches.length > 0 && (
                                <Text variant="bodySmall" style={styles.alertText}>
                                    Contains: {conflictResult.matches.join(', ')}
                                </Text>
                            )}
                            <Button
                                mode="text"
                                onPress={() => setShowWhyFlagged(true)}
                                style={styles.whyButton}
                                labelStyle={styles.whyButtonLabel}
                            >
                                Why was this flagged?
                            </Button>
                        </Card.Content>
                    </Card>
                )}

                <Divider style={styles.divider} />

                {/* Product Description */}
                <SectionHeader title="About this product" />
                <Text variant="bodyMedium" style={styles.description}>
                    {rawProduct?.category} product from {rawProduct?.brand}.
                    {rawProduct?.aisle && ` Located in aisle ${rawProduct.aisle}.`}
                </Text>

                <Divider style={styles.divider} />

                {/* Ingredients Section */}
                <SectionHeader title="Ingredients" />
                {product.ingredients && product.ingredients.length > 0 ? (
                    <View style={styles.ingredientsContainer}>
                        {product.ingredients.map((ingredient, index) => (
                            <IngredientChip
                                key={index}
                                name={ingredient}
                                isAllergen={conflictResult.matches.some(m =>
                                    ingredient.toLowerCase().includes(m.toLowerCase())
                                )}
                            />
                        ))}
                    </View>
                ) : (
                    <Text variant="bodyMedium" style={styles.noIngredients}>
                        No ingredient information available
                    </Text>
                )}

                {/* Swap Suggestions - Only show if product is unsafe */}
                {actualSafetyLevel !== 'safe' && (
                    <>
                        <Divider style={styles.divider} />
                        <SwapSuggestions
                            alternatives={alternatives}
                            originalProductId={productId}
                        />
                    </>
                )}

                <Divider style={styles.divider} />

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <PrimaryButton
                        label="Add to List"
                        onPress={handleAddToCart}
                        mode="contained"
                        style={styles.addButton}
                    />
                    <PrimaryButton
                        label="Share Product"
                        onPress={() => console.log('Share', product.id)}
                        mode="outlined"
                        style={styles.shareButton}
                    />
                </View>
            </View>

            {/* Why Flagged Bottom Sheet */}
            <WhyFlaggedSheet
                visible={showWhyFlagged}
                onDismiss={() => setShowWhyFlagged(false)}
                conflictResult={conflictResult}
                ingredients={product.ingredients || []}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: colors.surfaceVariant,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surfaceVariant,
    },
    infoContainer: {
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.md,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    productName: {
        flex: 1,
        marginRight: spacing.md,
    },
    price: {
        color: colors.primary,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    brand: {
        color: colors.onSurfaceVariant,
    },
    alertCard: {
        backgroundColor: colors.cautionContainer,
        marginTop: spacing.md,
    },
    alertTitle: {
        color: colors.onSurface,
        marginBottom: spacing.xs,
    },
    alertText: {
        color: colors.onSurfaceVariant,
    },
    whyButton: {
        marginTop: spacing.sm,
        alignSelf: 'flex-start',
    },
    whyButtonLabel: {
        fontSize: 13,
    },
    divider: {
        marginVertical: spacing.lg,
    },
    description: {
        color: colors.onSurface,
        lineHeight: 22,
        marginTop: spacing.sm,
    },
    ingredientsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    noIngredients: {
        color: colors.onSurfaceVariant,
        fontStyle: 'italic',
        marginTop: spacing.sm,
    },
    actions: {
        marginTop: spacing.lg,
        gap: spacing.md,
    },
    addButton: {
        marginBottom: spacing.sm,
    },
    shareButton: {},
});
