import { create } from 'zustand';
import { CostModifier, PathResult } from '../../modules/nav';

interface NavState {
    currentPath: PathResult | null;
    modifiers: CostModifier[];
    userPosition: string; // Current node ID
    setPath: (path: PathResult | null) => void;
    addModifier: (modifier: CostModifier) => void;
    removeModifier: (edgeId: string) => void;
    clearModifiers: () => void;
    setUserPosition: (nodeId: string) => void;
}

export const useNavStore = create<NavState>((set) => ({
    currentPath: null,
    modifiers: [],
    userPosition: 'entrance',

    setPath: (path) => set({ currentPath: path }),

    addModifier: (modifier) =>
        set((state) => ({
            modifiers: [...state.modifiers, modifier],
        })),

    removeModifier: (edgeId) =>
        set((state) => ({
            modifiers: state.modifiers.filter((m) => m.edgeId !== edgeId),
        })),

    clearModifiers: () => set({ modifiers: [] }),

    setUserPosition: (nodeId) => set({ userPosition: nodeId }),
}));
