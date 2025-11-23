import { products } from '../../data/products';
import productsData from '../../data/products.json';
import { checkConflicts, UserPreferences } from './checkConflicts';

export interface AlternativeProduct {
    id: string;
    name: string;
    price: string;
    imageUri?: string;
    category: string;
    aisle: string;
    tokens: string[];
    safetyLevel: 'safe' | 'caution' | 'hardstop';
    priceDifference: number;
}

/**
 * Find safe alternative products for a given product
 * @param productId - ID of the product to find alternatives for
 * @param preferences - User's dietary preferences and allergens
 * @param maxResults - Maximum number of alternatives to return (default: 3)
 * @returns Array of safe alternative products
 */
export function findSafeAlternatives(
    productId: string,
    preferences: UserPreferences,
    maxResults: number = 3
): AlternativeProduct[] {
    // Find the original product
    const originalProduct = products.find(p => p.id === productId);
    const originalRawProduct = (productsData as any).products.find((p: any) => p.id === productId);

    if (!originalProduct || !originalRawProduct) {
        return [];
    }

    const originalPrice = parseFloat(originalProduct.price.replace('$', ''));
    const originalCategory = originalRawProduct.category;
    const originalTokens = originalRawProduct.tokens || [];

    console.log('🔍 Finding alternatives for:', originalProduct.name);
    console.log('📁 Original category:', originalCategory);
    console.log('🏷️  Original tokens:', originalTokens);

    // Determine if we should also look for plant-based alternatives
    const isAnimalProduct = ['Meat', 'Poultry', 'Seafood', 'Fish', 'Dairy', 'Eggs'].includes(originalCategory);
    console.log('🥩 Is animal product?', isAnimalProduct);

    // Find all products
    const alternatives: AlternativeProduct[] = [];

    products.forEach(product => {
        // Skip the original product
        if (product.id === productId) return;

        const rawProduct = (productsData as any).products.find((p: any) => p.id === product.id);
        if (!rawProduct) return;

        // Include products if:
        // 1. Same category, OR
        // 2. Original is animal product and this is plant-based alternative
        const isSameCategory = rawProduct.category === originalCategory;
        const isPlantBasedAlternative = isAnimalProduct && rawProduct.category === 'Plant-Based Alternatives';

        if (!isSameCategory && !isPlantBasedAlternative) return;

        // Check safety level
        const tokens = rawProduct.tokens || [];
        const conflictResult = checkConflicts(preferences, tokens);

        // Include safe and caution products (both are better than hardstop)
        if (conflictResult.level === 'safe' || conflictResult.level === 'caution') {
            const price = parseFloat(product.price.replace('$', ''));
            const priceDifference = price - originalPrice;

            // Calculate relevance score for plant-based alternatives
            let relevanceScore = 0;
            if (isPlantBasedAlternative) {
                // Match specific types: chicken → chicken-alternative, fish → fish-alternative, etc.
                const hasChicken = originalTokens.some((t: string) => t.includes('chicken'));
                const hasFish = originalTokens.some((t: string) => t.includes('fish') || t.includes('salmon') || t.includes('tuna'));
                const hasBeef = originalTokens.some((t: string) => t.includes('beef'));
                const hasPork = originalTokens.some((t: string) => t.includes('pork') || t.includes('bacon') || t.includes('sausage'));

                console.log(`   Checking ${product.name}: hasFish=${hasFish}, tokens includes fish-alternative=${tokens.includes('fish-alternative')}`);

                if (hasChicken && tokens.includes('chicken-alternative')) relevanceScore = 100;
                else if (hasFish && tokens.includes('fish-alternative')) relevanceScore = 100;
                else if (hasBeef && tokens.includes('beef-alternative')) relevanceScore = 100;
                else if (hasPork && tokens.includes('sausage-alternative')) relevanceScore = 50;
                else relevanceScore = 10; // Generic plant-based

                console.log(`   → Relevance score: ${relevanceScore}`);
            }

            console.log(`✅ Adding alternative: ${product.name} (category: ${rawProduct.category}, safety: ${conflictResult.level}, relevance: ${relevanceScore})`);

            alternatives.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUri: product.imageUri,
                category: rawProduct.category,
                aisle: rawProduct.aisle,
                tokens: tokens,
                safetyLevel: conflictResult.level,
                priceDifference: priceDifference,
                relevanceScore: relevanceScore,
            } as any);
        } else {
            if (isPlantBasedAlternative) {
                console.log(`❌ Skipped ${product.name}: safety level = ${conflictResult.level}`);
            }
        }
    });

    console.log(`🎯 Total alternatives found: ${alternatives.length}`);
    alternatives.forEach(alt => console.log(`   - ${alt.name} (score: ${(alt as any).relevanceScore})`));

    // Sort alternatives by:
    // 1. Relevance score (for plant-based: specific match > generic)
    // 2. Same category first (prefer direct alternatives)
    // 3. Price similarity (prefer similar prices)
    // 4. Same aisle (for convenience)
    alternatives.sort((a: any, b: any) => {
        // Prefer higher relevance score
        if (b.relevanceScore !== a.relevanceScore) {
            return b.relevanceScore - a.relevanceScore;
        }

        // Prefer same-category alternatives
        const aIsSameCategory = a.category === originalCategory ? 1 : 0;
        const bIsSameCategory = b.category === originalCategory ? 1 : 0;

        if (aIsSameCategory !== bIsSameCategory) {
            return bIsSameCategory - aIsSameCategory;
        }

        const aPriceDiff = Math.abs(a.priceDifference);
        const bPriceDiff = Math.abs(b.priceDifference);

        // Prefer products with similar price
        if (aPriceDiff !== bPriceDiff) {
            return aPriceDiff - bPriceDiff;
        }

        // Prefer products in the same aisle
        const aInSameAisle = a.aisle === originalRawProduct.aisle ? 1 : 0;
        const bInSameAisle = b.aisle === originalRawProduct.aisle ? 1 : 0;

        return bInSameAisle - aInSameAisle;
    });

    // Return top N results
    return alternatives.slice(0, maxResults);
}

/**
 * Find the best single alternative for a product
 * @param productId - ID of the product to find alternative for
 * @param preferences - User's dietary preferences and allergens
 * @returns Best alternative product or null if none found
 */
export function findBestAlternative(
    productId: string,
    preferences: UserPreferences
): AlternativeProduct | null {
    const alternatives = findSafeAlternatives(productId, preferences, 1);
    return alternatives.length > 0 ? alternatives[0] : null;
}
