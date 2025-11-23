import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Card, IconButton } from 'react-native-paper';
import { colors, spacing } from '../theme/tokens';
import { PrimaryButton } from '../components/PrimaryButton';
import { IngredientChip } from '../components/IngredientChip';
import { SectionHeader } from '../components/SectionHeader';
import { InlineAlert } from '../components/InlineAlert';
import { useCartStore } from '../lib/stores/cartStore';

interface ParsedIngredient {
    name: string;
    id: string;
}

export const YouTubeScreen = () => {
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [parsedIngredients, setParsedIngredients] = useState<ParsedIngredient[]>([]);
    const { addItem } = useCartStore();

    const parseIngredients = () => {
        // Simple regex-based parsing
        const text = description.toLowerCase();
        const commonIngredients = [
            'flour', 'sugar', 'eggs', 'milk', 'butter', 'salt', 'pepper',
            'chicken', 'beef', 'pork', 'fish', 'rice', 'pasta', 'cheese',
            'tomato', 'onion', 'garlic', 'oil', 'water', 'cream'
        ];

        const found: ParsedIngredient[] = [];
        commonIngredients.forEach(ingredient => {
            if (text.includes(ingredient)) {
                found.push({
                    name: ingredient,
                    id: `${ingredient}-${Date.now()}`,
                });
            }
        });

        setParsedIngredients(found);
    };

    const removeIngredient = (id: string) => {
        setParsedIngredients(prev => prev.filter(ing => ing.id !== id));
    };

    const handleAddToCart = () => {
        parsedIngredients.forEach(ingredient => {
            addItem({
                productId: ingredient.id,
                name: ingredient.name,
                price: 0,
                aisle: 'A1',
                tokens: [],
                safetyLevel: 'safe',
            });
        });
        setParsedIngredients([]);
        setDescription('');
        setUrl('');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <SectionHeader title="YouTube Recipe Parser" />

                <InlineAlert
                    type="info"
                    title="YouTube Recipe Parser"
                    message="Paste a YouTube URL or video description to extract ingredients"
                />

                <TextInput
                    mode="outlined"
                    label="YouTube URL (optional)"
                    value={url}
                    onChangeText={setUrl}
                    style={styles.input}
                    placeholder="https://youtube.com/watch?v=..."
                />

                <TextInput
                    mode="outlined"
                    label="Video Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={6}
                    style={styles.input}
                    placeholder="Paste the video description here..."
                />

                <PrimaryButton
                    label="Parse Ingredients"
                    onPress={parseIngredients}
                    mode="contained"
                    style={styles.parseButton}
                    disabled={!description.trim()}
                />

                {parsedIngredients.length > 0 && (
                    <>
                        <SectionHeader
                            title={`Found ${parsedIngredients.length} Ingredients`}
                            actionLabel="Clear All"
                            onAction={() => setParsedIngredients([])}
                        />

                        <View style={styles.ingredientsContainer}>
                            {parsedIngredients.map(ingredient => (
                                <Card key={ingredient.id} style={styles.ingredientCard}>
                                    <Card.Content style={styles.cardContent}>
                                        <IngredientChip
                                            name={ingredient.name}
                                            isAllergen={false}
                                        />
                                        <IconButton
                                            icon="close"
                                            size={20}
                                            onPress={() => removeIngredient(ingredient.id)}
                                        />
                                    </Card.Content>
                                </Card>
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
        marginBottom: spacing.md,
    },
    parseButton: {
        marginBottom: spacing.xl,
    },
    ingredientsContainer: {
        marginBottom: spacing.lg,
    },
    ingredientCard: {
        marginBottom: spacing.sm,
        backgroundColor: colors.surfaceVariant,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addButton: {
        marginTop: spacing.lg,
    },
});
