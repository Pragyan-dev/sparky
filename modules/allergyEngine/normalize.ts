import synonymsData from '../../data/synonyms.json';

/**
 * Normalizes raw ingredient strings into standardized tokens
 * @param rawIngredients - Raw ingredient string (e.g., "Wheat Flour, Milk, Eggs")
 * @returns Array of normalized tokens
 */
export function normalize(rawIngredients: string): string[] {
    if (!rawIngredients) return [];

    // Split by common delimiters and clean
    const ingredients = rawIngredients
        .toLowerCase()
        .split(/[,;]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

    const tokens: string[] = [];

    // Extract individual words and match against synonyms
    ingredients.forEach((ingredient) => {
        const words = ingredient.split(/\s+/);

        // Check each word against allergen synonyms
        Object.entries(synonymsData.allergens).forEach(([allergen, synonyms]) => {
            synonyms.forEach((synonym) => {
                if (ingredient.includes(synonym.toLowerCase())) {
                    tokens.push(allergen);
                }
            });
        });

        // Also add the original words for non-allergen matching
        words.forEach((word) => {
            // Remove parentheses and special characters
            const cleaned = word.replace(/[()]/g, '').trim();
            if (cleaned.length > 2) {
                tokens.push(cleaned);
            }
        });
    });

    // Remove duplicates
    return Array.from(new Set(tokens));
}
