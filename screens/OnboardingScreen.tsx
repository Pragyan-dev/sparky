import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Text, Button, Chip, ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../theme/tokens';
import { useUserStore } from '../lib/stores/userStore';

const COMMON_ALLERGENS = [
    'milk', 'eggs', 'peanuts', 'tree nuts', 'soy',
    'wheat', 'fish', 'shellfish', 'sesame'
];

const DIET_OPTIONS = ['vegan', 'vegetarian', 'halal', 'kosher', 'none'];

export const OnboardingScreen = () => {
    const navigation = useNavigation<any>();
    const { completeOnboarding, addAllergen, addDiet } = useUserStore();

    const [step, setStep] = useState(1);
    const [selectedDiet, setSelectedDiet] = useState<string>('none');
    const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
    const [customAllergen, setCustomAllergen] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    const totalSteps = 3;
    const progress = step / totalSteps;

    const toggleAllergen = (allergen: string) => {
        setSelectedAllergens(prev =>
            prev.includes(allergen)
                ? prev.filter(a => a !== allergen)
                : [...prev, allergen]
        );
    };

    const handleComplete = () => {
        // Add selected allergens with hardstop severity
        selectedAllergens.forEach(allergen => {
            addAllergen(allergen, 'hardstop');
        });

        // Add selected diet
        if (selectedDiet !== 'none') {
            addDiet(selectedDiet);
        }

        completeOnboarding();
        navigation.replace('MainTabs');
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.stepContainer}>
                        <Text variant="headlineMedium" style={styles.title}>
                            Welcome to Sparky Shopper! 🛒
                        </Text>
                        <Text variant="bodyLarge" style={styles.subtitle}>
                            Let's personalize your shopping experience
                        </Text>
                        <Button
                            mode="contained"
                            onPress={() => setStep(2)}
                            style={styles.button}
                        >
                            Get Started
                        </Button>
                    </View>
                );

            case 2:
                return (
                    <View style={styles.stepContainer}>
                        <Text variant="headlineSmall" style={styles.title}>
                            Select Your Diet
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Choose one that applies to you
                        </Text>
                        <View style={styles.chipContainer}>
                            {DIET_OPTIONS.map(diet => (
                                <Chip
                                    key={diet}
                                    selected={selectedDiet === diet}
                                    onPress={() => setSelectedDiet(diet)}
                                    style={styles.chip}
                                >
                                    {diet.charAt(0).toUpperCase() + diet.slice(1)}
                                </Chip>
                            ))}
                        </View>
                        <Button
                            mode="contained"
                            onPress={() => setStep(3)}
                            style={styles.button}
                        >
                            Continue
                        </Button>
                    </View>
                );

            case 3:
                return (
                    <View style={styles.stepContainer}>
                        <Text variant="headlineSmall" style={styles.title}>
                            Any Allergies?
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Select all that apply
                        </Text>
                        <View style={styles.chipContainer}>
                            {COMMON_ALLERGENS.map(allergen => (
                                <Chip
                                    key={allergen}
                                    selected={selectedAllergens.includes(allergen)}
                                    onPress={() => toggleAllergen(allergen)}
                                    style={styles.chip}
                                >
                                    {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                                </Chip>
                            ))}
                            <Chip
                                selected={showCustomInput}
                                onPress={() => setShowCustomInput(!showCustomInput)}
                                style={styles.chip}
                            >
                                Other
                            </Chip>
                        </View>
                        {showCustomInput && (
                            <View style={styles.customInputContainer}>
                                <TextInput
                                    style={styles.customInput}
                                    placeholder="Enter custom allergy"
                                    value={customAllergen}
                                    onChangeText={setCustomAllergen}
                                    placeholderTextColor={colors.onSurfaceVariant}
                                />
                                <Button
                                    mode="outlined"
                                    onPress={() => {
                                        if (customAllergen.trim()) {
                                            toggleAllergen(customAllergen.trim().toLowerCase());
                                            setCustomAllergen('');
                                            setShowCustomInput(false);
                                        }
                                    }}
                                    style={{ marginTop: spacing.sm }}
                                >
                                    Add
                                </Button>
                            </View>
                        )}
                        <Button
                            mode="contained"
                            onPress={handleComplete}
                            style={styles.button}
                        >
                            Complete Setup
                        </Button>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <ProgressBar progress={progress} style={styles.progressBar} />
            {renderStep()}
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
    progressBar: {
        marginBottom: spacing.xl,
    },
    stepContainer: {
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: spacing.xl,
        color: colors.onSurfaceVariant,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        gap: spacing.sm,
    },
    chip: {
        margin: spacing.xs,
    },
    button: {
        marginTop: spacing.lg,
        minWidth: 200,
    },
    customInputContainer: {
        width: '100%',
        paddingHorizontal: spacing.lg,
        marginTop: spacing.md,
    },
    customInput: {
        height: 48,
        backgroundColor: colors.surfaceVariant,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        fontSize: 16,
        color: colors.onSurface,
        borderWidth: 1,
        borderColor: colors.outline,
    },
});
