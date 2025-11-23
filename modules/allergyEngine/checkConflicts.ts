import synonymsData from '../../data/synonyms.json';

export type AllergenSeverity = 'avoid' | 'hardstop';
export type SafetyLevel = 'safe' | 'caution' | 'hardstop';

export interface UserPreferences {
    allergens: {
        allergen: string;
        severity: AllergenSeverity;
    }[];
    diets: string[]; // e.g., ['vegan', 'gluten-free']
    customAvoid: string[];
}

export interface ConflictResult {
    level: SafetyLevel;
    reason: string;
    matches: string[];
    suggestions: string[];
}

/**
 * Check if product tokens conflict with user preferences
 * @param userPrefs - User's dietary preferences and allergens
 * @param tokens - Normalized ingredient tokens from product
 * @returns Conflict analysis result
 */
export function checkConflicts(
    userPrefs: UserPreferences,
    tokens: string[]
): ConflictResult {
    const matches: string[] = [];
    const suggestions: string[] = [];
    let hasHardstop = false;
    let hasCaution = false;

    // Check allergens
    userPrefs.allergens.forEach(({ allergen, severity }) => {
        const synonyms = synonymsData.allergens[allergen as keyof typeof synonymsData.allergens] || [];

        // Check if any token matches this allergen or its synonyms
        const hasMatch = tokens.some((token) =>
            synonyms.some((synonym) => token.toLowerCase().includes(synonym.toLowerCase()))
        );

        if (hasMatch) {
            matches.push(allergen);

            if (severity === 'hardstop') {
                hasHardstop = true;
            } else if (severity === 'avoid') {
                hasCaution = true;
            }
        }
    });

    // Check diet restrictions
    userPrefs.diets.forEach((diet) => {
        const dietInfo = synonymsData.diets[diet as keyof typeof synonymsData.diets];
        if (dietInfo && 'exclude' in dietInfo) {
            const excludeList = dietInfo.exclude;

            const hasMatch = tokens.some((token) =>
                excludeList.some((excluded) => token.toLowerCase().includes(excluded.toLowerCase()))
            );

            if (hasMatch) {
                matches.push(`${diet} restriction`);
                hasCaution = true;
            }
        }
    });

    // Check custom avoid list
    userPrefs.customAvoid.forEach((avoid) => {
        const hasMatch = tokens.some((token) =>
            token.toLowerCase().includes(avoid.toLowerCase())
        );

        if (hasMatch) {
            matches.push(avoid);
            hasCaution = true;
        }
    });

    // Determine safety level
    let level: SafetyLevel;
    let reason: string;

    if (hasHardstop) {
        level = 'hardstop';
        reason = `Contains allergen(s) marked as hard stop: ${matches.join(', ')}`;
    } else if (hasCaution) {
        level = 'caution';
        reason = `Contains ingredients to avoid: ${matches.join(', ')}`;
    } else {
        level = 'safe';
        reason = 'No conflicts detected';
    }

    // Generate suggestions (simplified - in real app would query products database)
    if (matches.length > 0) {
        suggestions.push('View swap suggestions');
        suggestions.push('Find similar products');
    }

    return {
        level,
        reason,
        matches,
        suggestions,
    };
}
