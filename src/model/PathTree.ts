import { Vertex } from "./Vertex";
import { Edge } from "./Edge";
import { PathNode } from "./PathNode";

export class PathTree {

    private nodes: Map<Vertex, PathNode>;

    constructor(origin: Vertex) {
        this.nodes = new Map<Vertex, PathNode>();
        // initialiser uniquement l'origine
        const originNode = new PathNode();
        originNode.cost = 0.0;
        originNode.reachingEdge = null;
        originNode.visited = false;
        this.nodes.set(origin, originNode);
    }

    isReached(vertex: Vertex): boolean {
        return this.nodes.has(vertex);
    }

    getOrCreateNode(vertex: Vertex): PathNode {
        if (!this.nodes.has(vertex)) {
            const node = new PathNode();
            node.cost = Number.POSITIVE_INFINITY;
            node.reachingEdge = null;
            node.visited = false;
            this.nodes.set(vertex, node);
        }
        return this.nodes.get(vertex);
    }

    getReachedVertices(): Vertex[] {
        return Array.from(this.nodes.keys());
    }

    /**
     * Construit le chemin depuis la destination
     */
    getPath(destination: Vertex): Edge[] {
        const edges: Edge[] = [];
        for (
            let current = this.getOrCreateNode(destination).reachingEdge;
            current != null;
            current = this.getOrCreateNode(current.getSource()).reachingEdge
        ) {
            edges.push(current);
        }
        return edges.reverse();
    }

    getNode(vertex: Vertex): PathNode {
        return this.getOrCreateNode(vertex);
    }
}
