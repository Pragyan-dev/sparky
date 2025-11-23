import { CostModifier } from './types';

/**
 * Create cost modifier for congested edge
 */
export function createCongestionModifier(from: string, to: string): CostModifier {
    return {
        edgeId: `${from}-${to}`,
        multiplier: 2.5, // 2.5x normal cost
        reason: 'Heavy congestion',
    };
}

/**
 * Create cost modifier for blocked edge (out of stock blocking aisle)
 */
export function createBlockedModifier(from: string, to: string): CostModifier {
    return {
        edgeId: `${from}-${to}`,
        multiplier: Infinity, // Completely blocked
        reason: 'Aisle blocked - out of stock',
    };
}

/**
 * Remove a cost modifier
 */
export function removeModifier(
    modifiers: CostModifier[],
    edgeId: string
): CostModifier[] {
    return modifiers.filter((mod) => mod.edgeId !== edgeId);
}

/**
 * Get all active modifiers
 */
export function getActiveModifiers(modifiers: CostModifier[]): string[] {
    return modifiers.map((mod) => `${mod.edgeId}: ${mod.reason}`);
}
