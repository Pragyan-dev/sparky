import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Chip, Searchbar, Snackbar } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { ProductCardPro } from '../components/ProductCardPro';
import { SectionHeader } from '../components/SectionHeader';
import { useNavigation } from '@react-navigation/native';
import { products } from '../data/products';
import productsData from '../data/products.json';
import { colors, spacing } from '../theme/tokens';
import { useUserStore } from '../lib/stores/userStore';
import { useCartStore } from '../lib/stores/cartStore';
import { checkConflicts } from '../modules/allergyEngine';

export const BrowseScreen = () => {
    const navigation = useNavigation<any>();
    const { preferences } = useUserStore();
    const { addItem } = useCartStore();
    const [filter, setFilter] = useState<'all' | 'safe' | 'caution' | 'hardstop'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Calculate safety levels for all products
    const productsWithSafety = products.map(product => {
        const rawProduct = (productsData as any).products.find((p: any) => p.id === product.id);
        const tokens = rawProduct?.tokens || [];
        const conflictResult = checkConflicts(preferences, tokens);
        return {
            ...product,
            actualSafetyLevel: conflictResult.level,
        };
    });

    const filtered = productsWithSafety.filter((p) => {
        const matchesFilter = filter === 'all' ? true : p.actualSafetyLevel === filter;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleAddToCart = (productId: string) => {
        const product = products.find(p => p.id === productId);
        const rawProduct = (productsData as any).products.find((p: any) => p.id === productId);

        if (!product || !rawProduct) return;

        const tokens = rawProduct.tokens || [];
        const conflictResult = checkConflicts(preferences, tokens);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        addItem({
            productId: product.id,
            name: product.name,
            price: parseFloat(product.price.replace('$', '')),
            aisle: rawProduct.aisle || 'A1',
            tokens: tokens,
            safetyLevel: conflictResult.level,
        });

        // Show toast notification
        setSnackbarMessage(`${product.name} added to cart!`);
        setSnackbarVisible(true);
    };

    const renderItem = ({ item }: { item: typeof productsWithSafety[0] }) => (
        <ProductCardPro
            productId={item.id}
            name={item.name}
            price={item.price}
            safetyLevel={item.actualSafetyLevel as any}
            imageUri={item.imageUri}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            onAddToCart={() => handleAddToCart(item.id)}
        />
    );

    return (
        <View style={styles.container}>
            <SectionHeader title="Browse Products" />
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search products..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>
            <View style={styles.filterRow}>
                {['all', 'safe', 'caution', 'hardstop'].map((type) => (
                    <Chip
                        key={type}
                        selected={filter === type}
                        onPress={() => setFilter(type as any)}
                        style={styles.chip}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Chip>
                ))}
            </View>
            <FlatList
                data={filtered}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
                action={{
                    label: 'View Cart',
                    onPress: () => navigation.navigate('Cart'),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    searchContainer: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
    },
    searchBar: {
        elevation: 2,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
        flexWrap: 'wrap',
    },
    chip: {
        marginBottom: spacing.xs,
    },
    list: {
        padding: spacing.md,
    },
});
