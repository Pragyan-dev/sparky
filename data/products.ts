import { Product } from './types';
import productsData from './products.json';

// Simple transformation from raw JSON to our Product type
export const products: Product[] = productsData.products.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: `$${p.price.toFixed(2)}`,
    safetyLevel: 'safe', // Placeholder – will be dynamically determined by allergy engine
    imageUri: p.image, // Use the image URL directly from JSON
    ingredients: p.rawIngredients ? p.rawIngredients.split(',').map((i: string) => i.trim()) : [],
}));
