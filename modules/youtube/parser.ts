import { mockYouTubeData } from './mockData';
import { normalize } from '../allergyEngine/normalize';

export interface ParsedIngredient {
    original: string;
    tokens: string[];
}

export interface ParseResult {
    title: string;
    ingredients: ParsedIngredient[];
    rawText: string;
}

/**
 * Extract YouTube video ID from URL
 */
function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

/**
 * Parse ingredients from description text using regex
 */
function parseIngredientsFromText(text: string): string[] {
    const lines = text.split('\n');
    const ingredients: string[] = [];

    // Common patterns for ingredient lists
    const ingredientPatterns = [
        /^[-•*]\s*(.+)$/,           // Bullet points
        /^\d+\.?\s+(.+)$/,          // Numbered lists
        /^(\d+\s*(?:cup|tbsp|tsp|oz|g|kg|lb|ml|l)\s+.+)$/i, // Measurements
    ];

    lines.forEach((line) => {
        const trimmed = line.trim();

        // Try each pattern
        for (const pattern of ingredientPatterns) {
            const match = trimmed.match(pattern);
            if (match) {
                ingredients.push(match[1] || match[0]);
                return;
            }
        }

        // If line looks like an ingredient (contains measurements or common ingredients)
        if (
            /\d+\s*(?:cup|tbsp|tsp|oz|g|kg|lb|ml|l)/i.test(trimmed) ||
            /(?:flour|sugar|salt|pepper|oil|butter|egg|milk|cheese)/i.test(trimmed)
        ) {
            ingredients.push(trimmed);
        }
    });

    return ingredients;
}

/**
 * Parse YouTube description for ingredients
 * @param input - YouTube URL or description text
 * @returns Parsed ingredients with tokens
 */
export async function parseYouTubeDescription(input: string): Promise<ParseResult> {
    // Check if input is a URL
    const videoId = extractVideoId(input);

    if (videoId && mockYouTubeData[videoId]) {
        // Use mock data for known URLs
        const mockData = mockYouTubeData[videoId];
        return {
            title: mockData.title,
            ingredients: mockData.ingredients.map((ing) => ({
                original: ing,
                tokens: normalize(ing),
            })),
            rawText: mockData.ingredients.join('\n'),
        };
    }

    // Parse as description text
    const parsedIngredients = parseIngredientsFromText(input);

    if (parsedIngredients.length === 0) {
        // Fallback: treat each line as potential ingredient
        const lines = input.split('\n').filter((line) => line.trim().length > 0);
        return {
            title: 'Parsed Recipe',
            ingredients: lines.map((line) => ({
                original: line.trim(),
                tokens: normalize(line),
            })),
            rawText: input,
        };
    }

    return {
        title: 'Parsed Recipe',
        ingredients: parsedIngredients.map((ing) => ({
            original: ing,
            tokens: normalize(ing),
        })),
        rawText: input,
    };
}
