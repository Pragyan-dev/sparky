import { Graph, GraphNode, PathResult, PathSegment, CostModifier } from './types';

interface AStarNode {
    id: string;
    g: number; // Cost from start
    h: number; // Heuristic to goal
    f: number; // Total cost (g + h)
    parent: string | null;
}

/**
 * Calculate Euclidean distance between two nodes (heuristic)
 */
function heuristic(node1: GraphNode, node2: GraphNode): number {
    const dx = node1.x - node2.x;
    const dy = node1.y - node2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get edge cost with modifiers applied
 */
function getEdgeCost(
    from: string,
    to: string,
    graph: Graph,
    modifiers: CostModifier[]
): number {
    const edge = graph.edges.find((e) =>
        (e.from === from && e.to === to) || (e.to === from && e.from === to)
    );

    if (!edge) return Infinity;

    let cost = edge.baseCost;

    // Apply modifiers
    const edgeId1 = `${from}-${to}`;
    const edgeId2 = `${to}-${from}`;

    modifiers.forEach((mod) => {
        if (mod.edgeId === edgeId1 || mod.edgeId === edgeId2) {
            cost *= mod.multiplier;
        }
    });

    return cost;
}

/**
 * A* pathfinding algorithm
 * @param graph - Store graph
 * @param start - Start node ID
 * @param goal - Goal node ID
 * @param modifiers - Cost modifiers for edges
 * @returns Path result with nodes and cost
 */
export function findPath(
    graph: Graph,
    start: string,
    goal: string,
    modifiers: CostModifier[] = []
): PathResult | null {
    const nodeMap = new Map<string, GraphNode>();
    graph.nodes.forEach((node) => nodeMap.set(node.id, node));

    const startNode = nodeMap.get(start);
    const goalNode = nodeMap.get(goal);

    if (!startNode || !goalNode) {
        return null;
    }

    const openSet = new Map<string, AStarNode>();
    const closedSet = new Map<string, AStarNode>(); // Store actual nodes for reconstruction

    // Initialize start node
    openSet.set(start, {
        id: start,
        g: 0,
        h: heuristic(startNode, goalNode),
        f: heuristic(startNode, goalNode),
        parent: null,
    });

    while (openSet.size > 0) {
        // Get node with lowest f score
        let current: AStarNode | null = null;
        let lowestF = Infinity;

        openSet.forEach((node) => {
            if (node.f < lowestF) {
                lowestF = node.f;
                current = node;
            }
        });

        if (!current) break;

        // TypeScript type assertion: current is guaranteed to be non-null here
        const currentNode = current as AStarNode;

        // Goal reached
        if (currentNode.id === goal) {
            // Reconstruct path
            const path: string[] = [];
            const segments: PathSegment[] = [];
            let node: AStarNode | null = currentNode;

            while (node) {
                path.unshift(node.id);
                if (node.parent) {
                    const cost = getEdgeCost(node.parent, node.id, graph, modifiers);
                    segments.unshift({
                        from: node.parent,
                        to: node.id,
                        cost,
                    });
                    node = closedSet.get(node.parent) || null;
                } else {
                    node = null;
                }
            }

            return {
                path,
                segments,
                totalCost: currentNode.g,
            };
        }

        openSet.delete(currentNode.id);
        closedSet.set(currentNode.id, currentNode); // Store in closedSet for reconstruction

        // Check neighbors
        graph.edges.forEach((edge) => {
            let neighbor: string | null = null;

            if (edge.from === currentNode.id) {
                neighbor = edge.to;
            } else if (edge.to === currentNode.id) {
                neighbor = edge.from;
            }

            if (!neighbor || closedSet.has(neighbor)) return;

            const neighborNode = nodeMap.get(neighbor);
            if (!neighborNode) return;

            const edgeCost = getEdgeCost(currentNode.id, neighbor, graph, modifiers);
            if (edgeCost === Infinity) return; // Blocked edge

            const tentativeG = currentNode.g + edgeCost;

            const existingNeighbor = openSet.get(neighbor);

            if (!existingNeighbor || tentativeG < existingNeighbor.g) {
                const h = heuristic(neighborNode, goalNode);
                openSet.set(neighbor, {
                    id: neighbor,
                    g: tentativeG,
                    h,
                    f: tentativeG + h,
                    parent: currentNode.id,
                });
            }
        });
    }

    // No path found
    return null;
}
