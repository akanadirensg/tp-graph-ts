import Coordinate from "./Coordinate";
import { Edge } from "./Edge";

/**
 * A vertex in a graph with an id and a location
 */
export class Vertex {
    /**
     * identifier of the vertex (debug purpose)
     */
    id: string;
    /**
     * location of the vertex
     */
    coordinate: Coordinate;

	_inEdges: Edge[];
	_outEdges: Edge[];
}
