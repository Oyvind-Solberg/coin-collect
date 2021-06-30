import { Graph } from '@datastructures-js/graph';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

export default class CustomGraph extends Graph {
	forEachVertices(callback) {
		this._vertices.forEach(callback);
	}
	getVertex(vertex) {
		return this._vertices.get(vertex);
	}
	setVertex(vertex, value) {
		return this._vertices.set(vertex, value);
	}
	vertexHasEdges(vertex) {
		const edges = this._edges.get(vertex);
		return edges.size > 0;
	}
	getValuesFromAllVertices() {
		const values = {};

		this.forEachVertices((value, vertex) => {
			values[vertex] = value;
		});

		return values;
	}
	countMatches(condition) {
		let total = 0;

		this.forEachVertices((value, vertex) => {
			if (condition(value)) total++;
		});

		return total;
	}
	findShortestPath(startVertex, endVertex) {
		const queue = new MinPriorityQueue();
		const distances = {};
		const previous = {};
		let smallestVertex;
		let shortestPath = [];

		// Build up initial state
		this._edges.forEach((value, vertex) => {
			if (vertex === startVertex) {
				distances[vertex] = 0;
				queue.enqueue(startVertex, 0);
			} else {
				distances[vertex] = Infinity;
				queue.enqueue(vertex, Infinity);
			}

			previous[vertex] = null;
		});

		// as longe as there is something to visit

		const callbackLoop = () => {
			if (queue.size() > 0) {
				smallestVertex = queue.dequeue().element;

				if (smallestVertex === endVertex) {
					// build up path to return at end
					let currentVertex = endVertex;

					while (currentVertex !== null && currentVertex !== undefined) {
						shortestPath.push(currentVertex);
						currentVertex = previous[currentVertex];
					}

					shortestPath.reverse();

					return shortestPath;
				}

				if (
					smallestVertex !== null &&
					smallestVertex !== undefined &&
					distances[smallestVertex] !== Infinity
				) {
					this._edges
						.get(smallestVertex)
						.forEach((neighborDistance, neighbor) => {
							// calculating new distance to neighboring node
							const distanceCandidate =
								distances[smallestVertex] + neighborDistance;

							if (distanceCandidate < distances[neighbor]) {
								// updating new smallest distance to neighbor
								distances[neighbor] = distanceCandidate;
								// update previous  How we got to neighbor
								previous[neighbor] = smallestVertex;
								// enqueue in priority queue with new priority
								queue.enqueue(neighbor, distanceCandidate);
							}
						});
				}

				return callbackLoop();
			}
		};
		return callbackLoop();
	}
}
