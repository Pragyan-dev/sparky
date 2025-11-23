import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { PrimaryButton } from './PrimaryButton';
import { SafetyBadge } from './SafetyBadge';
import { colors, spacing, borderRadius, elevation } from '../theme/tokens';

interface ProductCardProProps {
    productId: string;
    name: string;
    imageUri?: string;
    price: string;
    safetyLevel: 'safe' | 'caution' | 'hardstop';
    onPress?: () => void;
    onAddToCart?: () => void;
}

export const ProductCardPro: React.FC<ProductCardProProps> = ({
    name,
    imageUri,
    price,
    safetyLevel,
    onPress,
    onAddToCart,
}) => {
    return (
        <Card style={styles.card} onPress={onPress}>
            <View style={styles.imageContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text variant="titleMedium">No Image</Text>
                    </View>
                )}
                <View style={styles.badgeWrapper}>
                    <SafetyBadge level={safetyLevel} size="small" />
                </View>
            </View>
            <Card.Content>
                <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
                    {name}
                </Text>
                <Text variant="titleLarge" style={styles.price}>
                    {price}
                </Text>
            </Card.Content>
            <Card.Actions style={styles.actions}>
                <PrimaryButton
                    label="Add"
                    onPress={onAddToCart ?? (() => { })}
                    mode="contained"
                    style={styles.button}
                    labelStyle={{ fontSize: 12, marginVertical: 6 }}
                />
            </Card.Actions>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: spacing.xs,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surface,
        ...elevation.level1,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    imageContainer: {
        position: 'relative',
        height: 140,
        borderTopLeftRadius: borderRadius.md,
        borderTopRightRadius: borderRadius.md,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        flex: 1,
        backgroundColor: colors.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeWrapper: {
        position: 'absolute',
        top: spacing.xs,
        right: spacing.xs,
    },
    title: {
        marginTop: spacing.xs,
        color: colors.onSurface,
        fontSize: 14,
        fontWeight: '600',
        height: 40,
    },
    price: {
        marginTop: spacing.xs / 2,
        color: colors.primary,
        fontWeight: '600',
    },
    actions: {
        justifyContent: 'center',
        paddingHorizontal: spacing.sm,
        paddingBottom: spacing.sm,
    },
    button: {
        borderRadius: borderRadius.round,
        width: '100%',
    },
});
