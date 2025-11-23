import { create } from 'zustand';

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    aisle: string;
    tokens: string[];
    safetyLevel: 'safe' | 'caution' | 'hardstop';
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    swapItem: (oldProductId: string, newItem: Omit<CartItem, 'quantity'>) => void;
    clearCart: () => void;
    getGroupedByAisle: () => Record<string, CartItem[]>;
    getTotalPrice: () => number;
    getUnsafeItems: () => CartItem[];
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],

    addItem: (item) =>
        set((state) => {
            console.log('CartStore: addItem called with:', item);
            console.log('CartStore: Current items:', state.items);

            const existing = state.items.find((i) => i.productId === item.productId);
            if (existing) {
                console.log('CartStore: Item exists, incrementing quantity');
                const newItems = state.items.map((i) =>
                    i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
                );
                console.log('CartStore: New items after increment:', newItems);
                return {
                    items: newItems,
                };
            }
            console.log('CartStore: Adding new item to cart');
            const newItems = [...state.items, { ...item, quantity: 1 }];
            console.log('CartStore: New items after add:', newItems);
            return {
                items: newItems,
            };
        }),

    removeItem: (productId) =>
        set((state) => ({
            items: state.items.filter((i) => i.productId !== productId),
        })),

    updateQuantity: (productId, quantity) =>
        set((state) => ({
            items: state.items.map((i) =>
                i.productId === productId ? { ...i, quantity } : i
            ),
        })),

    swapItem: (oldProductId, newItem) =>
        set((state) => {
            const oldItem = state.items.find((i) => i.productId === oldProductId);
            const quantity = oldItem?.quantity || 1;
            return {
                items: state.items.map((i) =>
                    i.productId === oldProductId ? { ...newItem, quantity } : i
                ),
            };
        }),

    clearCart: () => set({ items: [] }),

    getGroupedByAisle: () => {
        const items = get().items;
        const grouped: Record<string, CartItem[]> = {};
        items.forEach((item) => {
            if (!grouped[item.aisle]) {
                grouped[item.aisle] = [];
            }
            grouped[item.aisle].push(item);
        });
        return grouped;
    },

    getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    getUnsafeItems: () => {
        return get().items.filter((item) => item.safetyLevel !== 'safe');
    },
}));
