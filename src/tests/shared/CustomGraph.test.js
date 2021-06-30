import CustomGraph from '../../shared/CustomGraph';

describe('CustomGraph', () => {
	let graph;

	beforeEach(() => {
		graph = new CustomGraph();
		graph.addVertex(0, { content: true });
		graph.addVertex(1, { content: true });
		graph.addVertex(2, { content: true });
		graph.addVertex(3, { content: true });
		graph.addVertex(4, { content: true });
		graph.addVertex(5, { content: true });

		graph.addEdge(0, 1, 4);
		graph.addEdge(1, 4, 3);
		graph.addEdge(4, 5, 1);
		graph.addEdge(0, 2, 2);
		graph.addEdge(2, 3, 2);
		graph.addEdge(2, 5, 4);
		graph.addEdge(3, 4, 3);
		graph.addEdge(3, 5, 1);

		// Graph diagram:
		//
		//           4
		//       0 ----- 1
		//      /         \
		//   2 /           \ 3
		//    /   2     3   \
		//   2 ----- 3 ----- 4
		//    \      |      /
		//    4 \   1|    / 1
		//        \  |  /
		//           5
	});

	describe('findShortestPath', () => {
		test('Should return shortest path', () => {
			expect(graph.findShortestPath(0, 4)).toStrictEqual([0, 2, 3, 5, 4]);
		});
	});

	describe('forEachVertices', () => {
		test('Should be able to set the value for each vertices', () => {
			graph.forEachVertices((value, vertex) => {
				graph.setVertex(vertex, { data: 'true' });
			});

			expect(graph.getVertex(4)).toEqual({ data: 'true' });
		});
	});
});
