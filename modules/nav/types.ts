export interface GraphNode {
    id: string;
    x: number;
    y: number;
    label: string;
}

export interface GraphEdge {
    from: string;
    to: string;
    baseCost: number;
}

export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
    aisleMapping: Record<string, string>;
}

export interface PathSegment {
    from: string;
    to: string;
    cost: number;
}

export interface PathResult {
    path: string[]; // Node IDs
    segments: PathSegment[];
    totalCost: number;
}

export interface CostModifier {
    edgeId: string; // "from-to"
    multiplier: number; // 1.0 = normal, 2.0 = double cost (congestion), Infinity = blocked
    reason: string;
}
