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
                    label="Add to List"
                    onPress={onAddToCart ?? (() => { })}
                    mode="contained"
                    style={styles.button}
                />
            </Card.Actions>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: spacing.sm,
        borderRadius: borderRadius.md,
        ...elevation.level2,
    },
    imageContainer: {
        position: 'relative',
        height: 180,
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
    },
    price: {
        marginTop: spacing.xs / 2,
        color: colors.primary,
        fontWeight: '600',
    },
    actions: {
        justifyContent: 'flex-end',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
    },
    button: {
        borderRadius: borderRadius.round,
    },
});
