import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Switch, Divider, List } from 'react-native-paper';
import { colors, spacing } from '../theme/tokens';
import { SectionHeader } from '../components/SectionHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useUserStore } from '../lib/stores/userStore';

export const SettingsScreen = () => {
    const { preferences, setPreferences } = useUserStore();
    const [demoMode, setDemoMode] = React.useState(false);

    const handleClearPreferences = () => {
        setPreferences({
            allergens: [],
            diets: [],
            customAvoid: [],
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <SectionHeader title="Settings" />

                <List.Section>
                    <List.Subheader>Preferences</List.Subheader>

                    <List.Item
                        title="Demo Mode"
                        description="Enable demo events and simulations"
                        right={() => (
                            <Switch
                                value={demoMode}
                                onValueChange={setDemoMode}
                            />
                        )}
                    />
                </List.Section>

                <Divider style={styles.divider} />

                <SectionHeader title="Your Allergies" />
                {preferences.allergens.length > 0 ? (
                    <View style={styles.listContainer}>
                        {preferences.allergens.map((item, index) => (
                            <Text key={index} variant="bodyMedium" style={styles.listItem}>
                                • {item.allergen.charAt(0).toUpperCase() + item.allergen.slice(1)} ({item.severity})
                            </Text>
                        ))}
                    </View>
                ) : (
                    <Text variant="bodyMedium" style={styles.emptyText}>
                        No allergies set
                    </Text>
                )}

                <Divider style={styles.divider} />

                <SectionHeader title="Your Diets" />
                {preferences.diets.length > 0 ? (
                    <View style={styles.listContainer}>
                        {preferences.diets.map((diet, index) => (
                            <Text key={index} variant="bodyMedium" style={styles.listItem}>
                                • {diet.charAt(0).toUpperCase() + diet.slice(1)}
                            </Text>
                        ))}
                    </View>
                ) : (
                    <Text variant="bodyMedium" style={styles.emptyText}>
                        No dietary restrictions set
                    </Text>
                )}

                <Divider style={styles.divider} />

                <PrimaryButton
                    label="Clear All Preferences"
                    onPress={handleClearPreferences}
                    mode="outlined"
                    style={styles.button}
                />

                <View style={styles.footer}>
                    <Text variant="bodySmall" style={styles.version}>
                        Sparky Shopper v1.0.0
                    </Text>
                    <Text variant="bodySmall" style={styles.copyright}>
                        © 2025 Sparky Shopper
                    </Text>
                </View>
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
    divider: {
        marginVertical: spacing.lg,
    },
    listContainer: {
        marginTop: spacing.sm,
    },
    listItem: {
        marginBottom: spacing.xs,
        color: colors.onSurface,
    },
    emptyText: {
        color: colors.onSurfaceVariant,
        fontStyle: 'italic',
        marginTop: spacing.sm,
    },
    button: {
        marginTop: spacing.xl,
    },
    footer: {
        marginTop: spacing.xl * 2,
        alignItems: 'center',
        paddingBottom: spacing.xl,
    },
    version: {
        color: colors.onSurfaceVariant,
        marginBottom: spacing.xs,
    },
    copyright: {
        color: colors.onSurfaceVariant,
    },
});
