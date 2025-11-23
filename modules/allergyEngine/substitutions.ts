export const substitutionMap: Record<string, string> = {
    // Dairy substitutions
    milk: 'almond milk or oat milk',
    butter: 'plant-based butter or coconut oil',
    cream: 'coconut cream or cashew cream',
    cheese: 'vegan cheese',
    yogurt: 'coconut yogurt or almond yogurt',
    'sour cream': 'cashew cream',
    parmesan: 'nutritional yeast',
    mozzarella: 'vegan mozzarella',
    feta: 'vegan feta',

    // Egg substitutions
    egg: 'flax egg or chia egg',
    eggs: 'flax eggs or applesauce',
    mayonnaise: 'vegan mayo',

    // Gluten substitutions
    'wheat flour': 'gluten-free flour blend',
    'all-purpose flour': 'gluten-free all-purpose flour',
    bread: 'gluten-free bread',
    pasta: 'gluten-free pasta or rice pasta',
    spaghetti: 'gluten-free spaghetti',
    'soy sauce': 'tamari or coconut aminos',
    croutons: 'gluten-free croutons',

    // Nut substitutions
    'peanut butter': 'sunflower seed butter',
    peanuts: 'sunflower seeds',
    almonds: 'sunflower seeds',
    cashews: 'sunflower seeds',
    walnuts: 'pumpkin seeds',
    'almond butter': 'sunflower seed butter',

    // Soy substitutions
    tofu: 'chickpeas or lentils',
    tempeh: 'mushrooms or seitan',
    'soy milk': 'oat milk or rice milk',

    // Sesame substitutions
    tahini: 'sunflower seed butter',
    'sesame seeds': 'poppy seeds',

    // Meat substitutions
    chicken: 'tofu or tempeh',
    beef: 'lentils or black beans',
    pork: 'jackfruit or mushrooms',
    bacon: 'tempeh bacon or coconut bacon',

    // Seafood substitutions
    shrimp: 'hearts of palm or tofu',
    fish: 'tofu or tempeh',
    'crab meat': 'hearts of palm',
    salmon: 'marinated tofu',

    // Other
    honey: 'maple syrup or agave nectar',
    gelatin: 'agar agar or pectin',
};

/**
 * Get substitution suggestion for an ingredient
 * @param ingredient - Ingredient to find substitution for
 * @returns Substitution suggestion or null
 */
export function getSubstitution(ingredient: string): string | null {
    const normalized = ingredient.toLowerCase().trim();
    return substitutionMap[normalized] || null;
}
