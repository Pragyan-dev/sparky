export interface Product {
    id: string;
    name: string;
    price: string;
    safetyLevel: 'safe' | 'caution' | 'hardstop';
    imageUri?: string;
    ingredients?: string[];
}

export interface RecipeIngredient {
    name: string;
    amount: string;
    tokens: string[];
}

export interface Recipe {
    id: string;
    name: string;
    category: string;
    servings: number;
    ingredients: RecipeIngredient[];
    substitutions: Record<string, string>;
}

export interface UserPreferences {
    allergies: string[];
    diets: string[];
    customAvoid: string[];
}
