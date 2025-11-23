import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../theme/tokens';
import { SectionHeader } from '../components/SectionHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { InteractiveStoreMap } from '../components/InteractiveStoreMap';

export const MapScreen = () => {
    const navigation = useNavigation<any>();
    const [viewMode, setViewMode] = useState('store');
    const [simulatedPath, setSimulatedPath] = useState<string[]>([]);

    const handleAislePress = (aisleId: string) => {
        console.log('Aisle selected:', aisleId);
    };

    const simulateNavigation = () => {
        // Demo path through the store
        setSimulatedPath(['A1', 'B1', 'C2', 'D1', 'E1']);
    };

    const categoryInfo = [
        { name: 'Produce', color: '#4CAF50' },
        { name: 'Dairy', color: '#2196F3' },
        { name: 'Frozen', color: '#00BCD4' },
        { name: 'Snacks', color: '#FF9800' },
        { name: 'Beverages', color: '#9C27B0' },
        { name: 'Bakery', color: '#FF5722' },
        { name: 'Deli', color: '#673AB7' },
        { name: 'Meat', color: '#F44336' },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <SectionHeader title="Store Navigation" />

                {/* 3D Map Exploration Button */}
                <PrimaryButton
                    label="🗺️ Explore in 3D Map"
                    onPress={() => navigation.navigate('Map3D')}
                    mode="contained"
                    style={styles.explore3DButton}
                />

                <SegmentedButtons
                    value={viewMode}
                    onValueChange={setViewMode}
                    buttons={[
                        { value: 'store', label: 'Store Map' },
                        { value: 'route', label: 'My Route' },
                    ]}
                    style={styles.segmented}
                />

                {viewMode === 'store' ? (
                    <>
                        <Card style={styles.mapCard}>
                            <View style={styles.mapContainer}>
                                <InteractiveStoreMap
                                    onAislePress={handleAislePress}
                                    highlightedPath={simulatedPath}
                                />
                            </View>
                        </Card>

                        <Card style={styles.legendCard}>
                            <Card.Content>
                                <Text variant="titleMedium" style={styles.legendTitle}>
                                    Store Sections
                                </Text>
                                <View style={styles.legendGrid}>
                                    {categoryInfo.map((category) => (
                                        <View key={category.name} style={styles.legendItem}>
                                            <View
                                                style={[
                                                    styles.colorBox,
                                                    { backgroundColor: category.color },
                                                ]}
                                            />
                                            <Text variant="bodySmall">{category.name}</Text>
                                        </View>
                                    ))}
                                </View>
                                <Text variant="bodySmall" style={styles.hint}>
                                    💡 Pinch to zoom, drag to pan
                                </Text>
                            </Card.Content>
                        </Card>
                    </>
                ) : (
                    <Card style={styles.mapCard}>
                        <Card.Content>
                            <View style={styles.mapPlaceholder}>
                                <Text variant="headlineSmall" style={styles.placeholderText}>
                                    🛒
                                </Text>
                                <Text variant="titleMedium" style={styles.placeholderTitle}>
                                    Optimized Route
                                </Text>
                                <Text variant="bodyMedium" style={styles.placeholderSubtitle}>
                                    Your shopping path will appear here
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                )}

                <View style={styles.infoSection}>
                    <SectionHeader title="Features" />

                    <Card style={styles.featureCard}>
                        <Card.Content>
                            <Text variant="titleMedium">✨ Smart Navigation</Text>
                            <Text variant="bodyMedium" style={styles.featureText}>
                                Get the fastest route through the store based on your cart items
                            </Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.featureCard}>
                        <Card.Content>
                            <Text variant="titleMedium">📍 Real-time Location</Text>
                            <Text variant="bodyMedium" style={styles.featureText}>
                                Track your position as you shop
                            </Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.featureCard}>
                        <Card.Content>
                            <Text variant="titleMedium">🔄 Dynamic Re-routing</Text>
                            <Text variant="bodyMedium" style={styles.featureText}>
                                Automatically adjust your path when items are out of stock
                            </Text>
                        </Card.Content>
                    </Card>
                </View>


                <PrimaryButton
                    label={simulatedPath.length > 0 ? "Clear Route" : "Simulate Navigation"}
                    onPress={() => {
                        if (simulatedPath.length > 0) {
                            setSimulatedPath([]);
                        } else {
                            simulateNavigation();
                        }
                    }}
                    mode="contained"
                    style={styles.startButton}
                />
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
        padding: spacing.lg,
    },
    segmented: {
        marginBottom: spacing.lg,
    },
    mapCard: {
        marginBottom: spacing.lg,
        backgroundColor: colors.surfaceVariant,
    },
    mapPlaceholder: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    placeholderText: {
        fontSize: 64,
        marginBottom: spacing.md,
    },
    placeholderTitle: {
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    placeholderSubtitle: {
        color: colors.onSurfaceVariant,
        textAlign: 'center',
    },
    infoSection: {
        marginTop: spacing.lg,
    },
    featureCard: {
        marginBottom: spacing.md,
        backgroundColor: colors.surface,
    },
    featureText: {
        marginTop: spacing.sm,
        color: colors.onSurfaceVariant,
    },
    startButton: {
        marginTop: spacing.xl,
    },
    mapContainer: {
        height: 400,
        backgroundColor: colors.surfaceVariant,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface,
        zIndex: 10,
    },
    loadingText: {
        marginTop: spacing.md,
        color: colors.onSurfaceVariant,
    },
    errorContainer: {
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    errorTitle: {
        marginTop: spacing.md,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    errorText: {
        color: colors.onSurfaceVariant,
        textAlign: 'center',
    },
    placeholderIcon: {
        fontSize: 64,
        marginBottom: spacing.md,
    },
    note: {
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        fontStyle: 'italic',
        paddingHorizontal: spacing.lg,
    },
    legendCard: {
        marginBottom: spacing.lg,
        backgroundColor: colors.surface,
    },
    legendTitle: {
        marginBottom: spacing.md,
        fontWeight: '600',
    },
    legendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingRight: spacing.md,
    },
    colorBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
    },
    hint: {
        color: colors.onSurfaceVariant,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    explore3DButton: {
        marginBottom: spacing.md,
    },
});
