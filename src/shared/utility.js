import { Graph } from '@datastructures-js/graph';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

// GRAPH

export class CustomGraph extends Graph {
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

					while (currentVertex) {
						shortestPath.push(currentVertex);
						currentVertex = previous[currentVertex];
					}

					shortestPath.reverse();

					return shortestPath;
				}

				if (smallestVertex && distances[smallestVertex] !== Infinity) {
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

// CONDITION CHECKING

export function anyValuesMatches(data, match) {
	if (Array.isArray(data)) {
		return data.some((value) => value === match);
	} else if (typeof data === 'object' && data !== null) {
		return Object.values(data).some((value) => value === match);
	}
}

export function anyConditionsAreSatisfied(...conditions) {
	return conditions.some((condition) => condition);
}

export function allConditionsAreSatisfied(...conditions) {
	return conditions.every((condition) => condition);
}

// CALLBACK LOOPS

export function runIterations(callback, totalIterations, iteration = 0) {
	if (iteration < totalIterations) {
		callback(iteration);
		runIterations(callback, totalIterations, iteration + 1);
	}
}

export function runSchedulingLoop(checkRunCondition, callback, speed) {
	setTimeout(function run() {
		if (checkRunCondition()) {
			callback();
			setTimeout(run(), speed);
		}
	});
}

export function runAcceleratingSchedulingLoop(
	checkRunCondition,
	callback,
	startSpeed,
	multiplier
) {
	setTimeout(function run(speed) {
		if (checkRunCondition()) {
			callback();
			const newSpeed = speed * multiplier;
			setTimeout(run(newSpeed), startSpeed);
		}
	});
}

// OPTION SELECTION

export function selectOption(selectionCallback, options, ...overrideArgs) {
	const overrideOption = options.find(
		(option) => option.override && option.override(...overrideArgs)
	);

	if (overrideOption) {
		return overrideOption.value;
	} else {
		return selectionCallback(options);
	}
}

export function selectByRatio(options) {
	const probabilityList = createProbabilityListByRange(options);
	const randomNumber = Math.random() * probabilityList.maxRange;
	const selectedOption = probabilityList.probabilityOptions.find((option) =>
		isNumberInRange(randomNumber, option.from, option.upTo)
	);

	return selectedOption.value;
}

export function createProbabilityListByRange(options) {
	return options.reduce(
		(prevList, option) => {
			const sum = prevList.maxRange;
			const nextSum = option.ratio + prevList.maxRange;
			const probabilityOption = assignProbabilityRange(option, sum, nextSum);

			return {
				maxRange: nextSum,
				probabilityOptions: [...prevList.probabilityOptions, probabilityOption],
			};
		},

		{
			maxRange: 0,
			probabilityOptions: [],
		}
	);
}

export function assignProbabilityRange(option, minSum, maxSum) {
	const from = minSum;
	const upTo = maxSum;

	return { value: option.value, from, upTo };
}

export function isNumberInRange(number, from, upTo) {
	return number >= from && number < upTo;
}
