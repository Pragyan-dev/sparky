import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Card, IconButton, Text, Snackbar } from 'react-native-paper';
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
    const [searchQuery, setSearchQuery] = React.useState('');
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
        <ProductCardPro
            productId={item.id}
            name={item.name}
            price={item.price}
            safetyLevel={item.safetyLevel as any}
            imageUri={item.imageUri}
            onPress={() => handlePress(item.id)}
            onAddToCart={() => handleAddToCart(item.id)}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search products..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

            <SectionHeader title="Quick Actions" />
            <View style={styles.quickActions}>
                <Card
                    style={[styles.actionCard, { backgroundColor: colors.primaryContainer }]}
                    onPress={() => navigation.navigate('Dish')}
                >
                    <Card.Content style={styles.actionContent}>
                        <IconButton icon="chef-hat" size={32} iconColor={colors.primary} />
                        <Card.Title
                            title="Cook a Dish"
                            titleVariant="titleMedium"
                            titleStyle={styles.actionTitle}
                        />
                    </Card.Content>
                </Card>

                <Card
                    style={[styles.actionCard, { backgroundColor: colors.secondaryContainer }]}
                    onPress={() => navigation.navigate('YouTube')}
                >
                    <Card.Content style={styles.actionContent}>
                        <IconButton icon="youtube" size={32} iconColor={colors.secondary} />
                        <Card.Title
                            title="YouTube Recipe"
                            titleVariant="titleMedium"
                            titleStyle={styles.actionTitle}
                        />
                    </Card.Content>
                </Card>

                <Card
                    style={[styles.actionCard, { backgroundColor: colors.tertiaryContainer }]}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Card.Content style={styles.actionContent}>
                        <IconButton icon="cog" size={32} iconColor={colors.tertiary} />
                        <Card.Title
                            title="Settings"
                            titleVariant="titleMedium"
                            titleStyle={styles.actionTitle}
                        />
                    </Card.Content>
                </Card>
            </View>

            <SectionHeader title="Featured Products" />
            <FlatList
                data={products.filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
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
    header: {
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    searchBar: {
        elevation: 2,
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    actionCard: {
        flex: 1,
        elevation: 2,
    },
    actionContent: {
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    actionTitle: {
        textAlign: 'center',
        fontSize: 12,
    },
    list: {
        padding: spacing.md,
    },
});
