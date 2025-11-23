export interface Coupon {
    id: string;
    code: string;
    description: string;
    discountType: 'fixed' | 'percentage';
    discountValue: number;
    applicableCategory?: string;
    applicableProductIds?: string[];
    minQuantity?: number;
}

export const coupons: Coupon[] = [
    {
        id: 'cpn-001',
        code: 'DAIRY1',
        description: '$1.00 off any Milk',
        discountType: 'fixed',
        discountValue: 1.00,
        applicableCategory: 'Dairy',
        minQuantity: 1
    },
    {
        id: 'cpn-002',
        code: 'PASTA2',
        description: 'Buy 2 Pastas, Save $1.00',
        discountType: 'fixed',
        discountValue: 1.00,
        applicableCategory: 'Pasta',
        minQuantity: 2
    },
    {
        id: 'cpn-003',
        code: 'SNACK20',
        description: '20% off Snacks',
        discountType: 'percentage',
        discountValue: 20, // 20%
        applicableCategory: 'Snacks',
        minQuantity: 1
    },
    {
        id: 'cpn-004',
        code: 'MEAT2',
        description: '$2.00 off Ground Beef',
        discountType: 'fixed',
        discountValue: 2.00,
        applicableProductIds: ['prod-017'], // Ground Beef
        minQuantity: 1
    },
    {
        id: 'cpn-005',
        code: 'WELCOME5',
        description: '$5.00 off your order over $50',
        discountType: 'fixed',
        discountValue: 5.00,
        minQuantity: 1
    }
];
