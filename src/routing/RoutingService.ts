import { Vertex } from "../model/Vertex";
import { Graph } from "../model/Graph";
import { Edge } from "../model/Edge";
import { PathNode } from "../model/PathNode";
import { RouteNotFound } from "../errors/RouteNotFound";

/**
 * Find routes using Dijkstra's algorithm.
 * 
 * @see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
export class RoutingService {

    private nodes: Map<Vertex,PathNode>;

    constructor(
        private graph: Graph
    ) {
        this.nodes = new Map<Vertex, PathNode>();
    }

    getNode(vertex: Vertex): PathNode{
        return this.nodes.get(vertex)
    }

    /**
     * Find a route between an origin and a destination
     */
    findRoute(origin: Vertex, destination: Vertex): Edge[] {
        // prepare graph for the visit
        this.initGraph(origin);

        // visit all vertices
        let current: Vertex | null;
        while ((current = this.findNextVertex()) != null) {
            this.visit(current);

            // until the destination is reached...
            if (this.getNode(destination).cost != Number.POSITIVE_INFINITY) {
                return this.buildRoute(destination);
            }
        }

        throw new RouteNotFound(`no route found from '${origin.id}' to '${destination.id}'`);
    }

    /**
     * Prepare the graph to find a route from an origin.
     */
    initGraph(origin: Vertex) {
        for (let vertex of this.graph.vertices) {
            const pathNode = new PathNode();
            pathNode.cost = origin == vertex ? 0.0 : Number.POSITIVE_INFINITY;
            pathNode.reachingEdge = null;
            pathNode.visited = false;
            this.nodes.set(vertex, pathNode);
        }
    }

    /**
     * Explores out edges for a given vertex and try to reach vertex with a better cost.
     */
    private visit(vertex: Vertex) {
        for (const outEdge of this.graph.getOutEdges(vertex)) {
            const reachedVertex = outEdge.getTarget();
            /*
             * Test if reachedVertex is reached with a better cost.
             * (Note that the cost is POSITIVE_INFINITY for unreached vertex)
             */
            
            const newCost = this.getNode(vertex).cost + outEdge.getLength();
            const reachedPathNode = this.getNode(reachedVertex)
            if (newCost < reachedPathNode.cost) {
                reachedPathNode.cost = newCost;
                reachedPathNode.reachingEdge = outEdge;
            }
        }
        // mark vertex as visited
        this.getNode(vertex).visited = true;
    }

    /**
     * Find the next vertex to visit. With Dijkstra's algorithm, 
     * it is the nearest vertex of the origin that is not already visited.
     */
    findNextVertex(): Vertex | null {
        let candidate: Vertex | null = null;
        for (const vertex of this.graph.vertices) {
            const vertexPathNode = this.getNode(vertex)
            // already visited?
            if (vertexPathNode.visited) {
                continue;
            }
            // not reached?
            if (vertexPathNode.cost == Number.POSITIVE_INFINITY) {
                continue;
            }
            // nearest from origin?
            if (candidate == null || vertexPathNode.cost < this.getNode(candidate).cost) {
                candidate = vertex;
            }
        }
        return candidate;
    }

    /**
     * Build route to the reached destination.
     */
    private buildRoute(destination: Vertex): Edge[] {
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

}
