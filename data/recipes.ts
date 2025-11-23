import { Recipe } from './types';
import recipesData from './recipes.json';

// Transform recipes from JSON to typed Recipe objects
export const recipes: Recipe[] = (recipesData as any).recipes.map((r: any) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    servings: r.servings,
    ingredients: r.ingredients,
    substitutions: r.substitutions || {},
}));
