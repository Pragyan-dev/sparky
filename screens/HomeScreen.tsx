import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Snackbar } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { ProductCardPro } from '../components/ProductCardPro';
import { SectionHeader } from '../components/SectionHeader';
import { useNavigation } from '@react-navigation/native';
import { Product } from '../data/types';
import { products } from '../data/products';
import productsData from '../data/products.json';
import { colors, spacing } from '../theme/tokens';
import { FlatList } from 'react-native';
import { useCartStore } from '../lib/stores/cartStore';
import { useUserStore } from '../lib/stores/userStore';
import { checkConflicts } from '../modules/allergyEngine';

export const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const { addItem } = useCartStore();
    const { preferences } = useUserStore();

    const handlePress = (productId: string) => {
        navigation.navigate('ProductDetail', { productId });
    };

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

    const renderItem = ({ item }: { item: Product }) => (
        <View style={{ flex: 1, maxWidth: '50%' }}>
            <ProductCardPro
                productId={item.id}
                name={item.name}
                price={item.price}
                safetyLevel={item.safetyLevel as any}
                imageUri={item.imageUri}
                onPress={() => handlePress(item.id)}
                onAddToCart={() => handleAddToCart(item.id)}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.storeHeader}>
                <Image
                    source={require('../assets/pod_logo.png')}
                    style={styles.storeLogo}
                    resizeMode="contain"
                />
            </View>
            <SectionHeader title="Featured Products" />
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                ListEmptyComponent={
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text variant="bodyLarge" style={{ color: colors.onSurfaceVariant }}>
                            No products found
                        </Text>
                    </View>
                }
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
    storeHeader: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
        backgroundColor: colors.surface,
        alignItems: 'center',
    },
    storeLogo: {
        width: 200,
        height: 80,
    },
    header: {
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    list: {
        padding: spacing.sm,
    },
    columnWrapper: {
        gap: spacing.sm,
    },
});
