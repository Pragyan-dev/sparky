import { Graph, PathResult, CostModifier } from './types';
import { findPath } from './astar';

/**
 * Calculate total distance for a route through multiple stops
 */
function calculateRouteDistance(
    graph: Graph,
    route: string[],
    modifiers: CostModifier[]
): number {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const path = findPath(graph, route[i], route[i + 1], modifiers);
        if (path) {
            total += path.totalCost;
        } else {
            return Infinity; // Invalid route
        }
    }
    return total;
}

/**
 * 2-opt optimization for multi-stop routes
 * Attempts to improve route by reversing segments
 * @param graph - Store graph
 * @param stops - Array of stop node IDs (excluding start/end)
 * @param start - Start node ID
 * @param end - End node ID
 * @param modifiers - Cost modifiers
 * @returns Optimized route
 */
export function optimizeRoute(
    graph: Graph,
    stops: string[],
    start: string,
    end: string,
    modifiers: CostModifier[] = []
): string[] {
    if (stops.length <= 1) {
        return [start, ...stops, end];
    }

    let route = [start, ...stops, end];
    let improved = true;
    let bestDistance = calculateRouteDistance(graph, route, modifiers);

    // 2-opt algorithm
    while (improved) {
        improved = false;

        for (let i = 1; i < route.length - 2; i++) {
            for (let j = i + 1; j < route.length - 1; j++) {
                // Create new route by reversing segment between i and j
                const newRoute = [
                    ...route.slice(0, i),
                    ...route.slice(i, j + 1).reverse(),
                    ...route.slice(j + 1),
                ];

                const newDistance = calculateRouteDistance(graph, newRoute, modifiers);

                if (newDistance < bestDistance) {
                    route = newRoute;
                    bestDistance = newDistance;
                    improved = true;
                }
            }
        }
    }

    return route;
}

/**
 * Build complete path through optimized route
 */
export function buildOptimizedPath(
    graph: Graph,
    stops: string[],
    start: string,
    end: string,
    modifiers: CostModifier[] = []
): PathResult | null {
    const optimizedRoute = optimizeRoute(graph, stops, start, end, modifiers);

    const fullPath: string[] = [];
    const allSegments: any[] = [];
    let totalCost = 0;

    for (let i = 0; i < optimizedRoute.length - 1; i++) {
        const segment = findPath(graph, optimizedRoute[i], optimizedRoute[i + 1], modifiers);
        if (!segment) return null;

        // Add path nodes (skip first if not first segment to avoid duplicates)
        if (i === 0) {
            fullPath.push(...segment.path);
        } else {
            fullPath.push(...segment.path.slice(1));
        }

        allSegments.push(...segment.segments);
        totalCost += segment.totalCost;
    }

    return {
        path: fullPath,
        segments: allSegments,
        totalCost,
    };
}
