import { Graph } from "./Graph";
import { PathNode } from "./PathNode";
import { Vertex } from "./Vertex";
import { Edge } from "./Edge";

export class PathTree {

    private nodes: Map<Vertex,PathNode>

    constructor(graph: Graph, origin: Vertex) {
        this.nodes = new Map<Vertex, PathNode>();
        for (let vertex of graph.vertices) {
            const pathNode = new PathNode();
            pathNode.cost = origin == vertex ? 0.0 : Number.POSITIVE_INFINITY;
            pathNode.reachingEdge = null;
            pathNode.visited = false;
            this.nodes.set(vertex, pathNode);
        }
    }

    /**
     * Build route to the reached destination.
     */
    getPath(destination: Vertex): Edge[] {
        const edges: Edge[] = [];
        for (
            let current = this.getNode(destination).reachingEdge;
            current != null;
            current = this.getNode(current.getSource()).reachingEdge
        ) {
            edges.push(current);
        }

        return edges.reverse();
    }

    getNode(vertex: Vertex): PathNode{
        return this.nodes.get(vertex)
    }

}