import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, TextInput, Card, IconButton } from 'react-native-paper';
import { colors, spacing } from '../theme/tokens';
import { recipes } from '../data/recipes';
import { Recipe } from '../data/types';
import { PrimaryButton } from '../components/PrimaryButton';
import { IngredientChip } from '../components/IngredientChip';
import { SectionHeader } from '../components/SectionHeader';
import { SafetyBadge } from '../components/SafetyBadge';
import { useCartStore } from '../lib/stores/cartStore';

export const DishScreen = () => {
    const [dishName, setDishName] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [servings, setServings] = useState(4);
    const { addItem } = useCartStore();

    const handleAddToCart = () => {
        if (selectedRecipe) {
            selectedRecipe.ingredients.forEach(ingredient => {
                addItem({
                    productId: `${selectedRecipe.id}-${ingredient.name}`,
                    name: ingredient.name,
                    price: 0,
                    aisle: 'A1',
                    tokens: ingredient.tokens,
                    safetyLevel: 'safe',
                });
            });
        }
    };

    const adjustServings = (delta: number) => {
        setServings(prev => Math.max(1, prev + delta));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <SectionHeader title="What are you cooking?" />

                <TextInput
                    mode="outlined"
                    label="Dish Name (optional)"
                    value={dishName}
                    onChangeText={setDishName}
                    style={styles.input}
                    placeholder="e.g., Pasta Carbonara"
                />

                <SectionHeader title="Choose a Recipe" />

                <FlatList
                    data={recipes}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Card
                            style={[
                                styles.recipeCard,
                                selectedRecipe?.id === item.id && styles.selectedCard
                            ]}
                            onPress={() => setSelectedRecipe(item)}
                        >
                            <Card.Content>
                                <Text variant="titleMedium">{item.name}</Text>
                                <Text variant="bodySmall" style={styles.category}>
                                    {item.category}
                                </Text>
                                <SafetyBadge level="safe" style={styles.badge} />
                            </Card.Content>
                        </Card>
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.recipeList}
                />

                {selectedRecipe && (
                    <>
                        <SectionHeader title="Servings" />
                        <View style={styles.servingsContainer}>
                            <IconButton
                                icon="minus"
                                size={24}
                                onPress={() => adjustServings(-1)}
                            />
                            <Text variant="headlineMedium" style={styles.servingsText}>
                                {servings}
                            </Text>
                            <IconButton
                                icon="plus"
                                size={24}
                                onPress={() => adjustServings(1)}
                            />
                        </View>

                        <SectionHeader title="Ingredients" />
                        <View style={styles.ingredientsContainer}>
                            {selectedRecipe.ingredients.map((ingredient, index) => (
                                <IngredientChip
                                    key={index}
                                    name={`${ingredient.name} (${ingredient.amount})`}
                                    isAllergen={false}
                                />
                            ))}
                        </View>

                        <PrimaryButton
                            label="Add All to Cart"
                            onPress={handleAddToCart}
                            mode="contained"
                            style={styles.addButton}
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    content: {
        padding: spacing.md,
    },
    input: {
        marginBottom: spacing.lg,
    },
    recipeList: {
        paddingVertical: spacing.sm,
    },
    recipeCard: {
        width: 200,
        marginRight: spacing.md,
        backgroundColor: colors.surfaceVariant,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: colors.primary,
    },
    category: {
        color: colors.onSurfaceVariant,
        marginTop: spacing.xs,
    },
    badge: {
        marginTop: spacing.sm,
    },
    servingsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.md,
    },
    servingsText: {
        marginHorizontal: spacing.lg,
        minWidth: 60,
        textAlign: 'center',
    },
    ingredientsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    addButton: {
        marginTop: spacing.lg,
    },
});
