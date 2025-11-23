import { create } from 'zustand';
import { UserPreferences } from '../../data/types';

interface UserState {
    preferences: UserPreferences;
    setPreferences: (prefs: UserPreferences) => void;
    clearPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
    allergies: [],
    diets: [],
    customAvoid: [],
};

export const useUserStore = create<UserState>((set) => ({
    preferences: defaultPreferences,
    setPreferences: (prefs) => set({ preferences: prefs }),
    clearPreferences: () => set({ preferences: defaultPreferences }),
}));
