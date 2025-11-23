import { create } from 'zustand';
import { UserPreferences } from '../../modules/allergyEngine';

interface UserState {
    preferences: UserPreferences;
    isOnboarded: boolean;
    setPreferences: (prefs: Partial<UserPreferences>) => void;
    addAllergen: (allergen: string, severity: 'avoid' | 'hardstop') => void;
    removeAllergen: (allergen: string) => void;
    addDiet: (diet: string) => void;
    removeDiet: (diet: string) => void;
    addCustomAvoid: (item: string) => void;
    removeCustomAvoid: (item: string) => void;
    completeOnboarding: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    preferences: {
        allergens: [],
        diets: [],
        customAvoid: [],
    },
    isOnboarded: false,

    setPreferences: (prefs) =>
        set((state) => ({
            preferences: { ...state.preferences, ...prefs },
        })),

    addAllergen: (allergen, severity) =>
        set((state) => ({
            preferences: {
                ...state.preferences,
                allergens: [...state.preferences.allergens, { allergen, severity }],
            },
        })),

    removeAllergen: (allergen) =>
        set((state) => ({
            preferences: {
                ...state.preferences,
                allergens: state.preferences.allergens.filter((a) => a.allergen !== allergen),
            },
        })),

    addDiet: (diet) =>
        set((state) => ({
            preferences: {
                ...state.preferences,
                diets: [...state.preferences.diets, diet],
            },
        })),

    removeDiet: (diet) =>
        set((state) => ({
            preferences: {
                ...state.preferences,
                diets: state.preferences.diets.filter((d) => d !== diet),
            },
        })),

    addCustomAvoid: (item) =>
        set((state) => ({
            preferences: {
                ...state.preferences,
                customAvoid: [...state.preferences.customAvoid, item],
            },
        })),

    removeCustomAvoid: (item) =>
        set((state) => ({
            preferences: {
                ...state.preferences,
                customAvoid: state.preferences.customAvoid.filter((i) => i !== item),
            },
        })),

    completeOnboarding: () => set({ isOnboarded: true }),
}));
