import { Vertex } from "../model/Vertex";
import { Graph } from "../model/Graph";
import { Edge } from "../model/Edge";
import { PathNode } from "../model/PathNode";
import { RouteNotFound } from "../errors/RouteNotFound";
import { PathTree } from "../model/PathTree";

/**
 * Find routes using Dijkstra's algorithm.
 * 
 * @see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
export class RoutingService {

    private pathTree: PathTree;

    constructor(
        private graph: Graph,
    ) {
        this.pathTree = null;
    }


    /**
     * Find a route between an origin and a destination
     */
    findRoute(origin: Vertex, destination: Vertex): Edge[] {
        // prepare graph for the visit
        this.pathTree = new PathTree(origin)

        // visit all vertices
        let current: Vertex | null;
        while ((current = this.findNextVertex()) != null) {
            this.visit(current);

            // until the destination is reached...
            if (this.pathTree.isReached(destination)) {
                return this.pathTree.getPath(destination);
            }
        }

        throw new RouteNotFound(`no route found from '${origin.id}' to '${destination.id}'`);
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
            
            const newCost = this.pathTree.getNode(vertex).cost + outEdge.getLength();
            const reachedPathNode = this.pathTree.getNode(reachedVertex)
            if (newCost < reachedPathNode.cost) {
                reachedPathNode.cost = newCost;
                reachedPathNode.reachingEdge = outEdge;
            }
        }
        // mark vertex as visited
        this.pathTree.getNode(vertex).visited = true;
    }

    /**
     * Find the next vertex to visit. With Dijkstra's algorithm, 
     * it is the nearest vertex of the origin that is not already visited.
     */
    findNextVertex(): Vertex | null {
        let candidate: Vertex | null = null;
        for (const vertex of this.pathTree.getReachedVertices()) {
            const node = this.pathTree.getNode(vertex);
            if (node.visited) continue;
            if (candidate == null || node.cost < this.pathTree.getNode(candidate).cost) {
                candidate = vertex;
            }
        }
        return candidate;
    }



}
