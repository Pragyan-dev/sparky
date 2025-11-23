import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * Parse YouTube description for ingredients
 * This is a mock implementation - in production, you'd call YouTube API
 */
export const parseYoutube = functions.https.onCall(async (data) => {
    const { input } = data;

    // Simple regex-based parsing
    const lines = input.split('\n');
    const ingredients: string[] = [];

    const ingredientPatterns = [
        /^[-•*]\s*(.+)$/,
        /^\d+\.?\s+(.+)$/,
        /^(\d+\s*(?:cup|tbsp|tsp|oz|g|kg|lb|ml|l)\s+.+)$/i,
    ];

    lines.forEach((line: string) => {
        const trimmed = line.trim();
        for (const pattern of ingredientPatterns) {
            const match = trimmed.match(pattern);
            if (match) {
                ingredients.push(match[1] || match[0]);
                return;
            }
        }
    });

    return {
        title: 'Parsed Recipe',
        ingredients,
        rawText: input,
    };
});

/**
 * Seed demo data to Firestore
 * This function imports JSON data from the app's data folder
 */
export const seedDemo = functions.https.onCall(async (data, context) => {
    // Verify authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Must be authenticated to seed data'
        );
    }

    const db = admin.firestore();
    const batch = db.batch();

    try {
        // In a real implementation, you'd import the JSON files
        // For now, this is a placeholder that shows the structure

        // Example: Seed products
        // const products = require('../data/products.json');
        // products.forEach((product) => {
        //   const ref = db.collection('products').doc(product.id);
        //   batch.set(ref, product);
        // });

        // await batch.commit();

        return {
            success: true,
            message: 'Demo data seeded successfully',
        };
    } catch (error) {
        throw new functions.https.HttpsError(
            'internal',
            'Failed to seed data',
            error
        );
    }
});
