import * as utility from '../../shared/utility';

describe('CustomGraph', () => {
	let graph;

	beforeEach(() => {
		graph = new utility.CustomGraph();
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

describe('anyValuesMatches', () => {
	let object;
	let array;

	beforeEach(() => {
		object = { a: 1, b: '2', c: 3 };
		array = [1, '2', 3];
	});
	test('Should check for supported types', () => {
		expect(utility.anyValuesMatches(object, 1)).toBe(true);
		expect(utility.anyValuesMatches(array, 1)).toBe(true);
		expect(utility.anyValuesMatches(null, 1)).toBe(undefined);
		expect(utility.anyValuesMatches(undefined, 1)).toBe(undefined);
	});
	test('Should check for matching values', () => {
		expect(utility.anyValuesMatches(object, '2')).toBe(true);
		expect(utility.anyValuesMatches(array, '2')).toBe(true);
		expect(utility.anyValuesMatches(object, 4)).toBe(false);
		expect(utility.anyValuesMatches(array, 4)).toBe(false);
	});
});

describe('runIterations', () => {
	test('Should run the callback function the same number of times as the iteration number', () => {
		let count = 0;
		utility.runIterations(() => count++, 10);
		expect(count).toBe(10);
	});
});

describe('isNumberInRange', () => {
	test('Should check if number are between from number and upTo number, including from number', () => {
		expect(utility.isNumberInRange(2, 3, 4)).toBe(false);
		expect(utility.isNumberInRange(3, 3, 4)).toBe(true);
		expect(utility.isNumberInRange(3.5, 3, 4)).toBe(true);
		expect(utility.isNumberInRange(4, 3, 4)).toBe(false);
		expect(utility.isNumberInRange(5, 3, 4)).toBe(false);
	});
});

describe('assignProbabilityRange', () => {
	test('Should return an object with value, from number and upTo number', () => {
		const option = { value: 'dirt', ratio: 1 };
		expect(utility.assignProbabilityRange(option, 0, 1)).toEqual({
			value: 'dirt',
			from: 0,
			upTo: 1,
		});
	});
});

describe('createProbabilityListByRange', () => {
	test('Should return a probability list', () => {
		const options = [
			{
				value: 'grass',
				ratio: 1,
			},
			{ value: 'dirt', ratio: 1 },
			{ value: 'wall', ratio: 1 },
		];

		expect(utility.createProbabilityListByRange(options)).toEqual({
			maxRange: 3,
			probabilityOptions: [
				{
					value: 'grass',
					from: 0,
					upTo: 1,
				},
				{
					value: 'dirt',
					from: 1,
					upTo: 2,
				},
				{
					value: 'wall',
					from: 2,
					upTo: 3,
				},
			],
		});
	});
});

describe('selectByRatio', () => {
	test('Should return option by ratio', () => {
		const optionsA = [
			{
				value: 'grass',
				ratio: 0,
			},
			{ value: 'dirt', ratio: 1 },
			{ value: 'wall', ratio: 1 },
		];

		const optionsB = [
			{
				value: 'grass',
				ratio: 1,
			},
			{ value: 'dirt', ratio: 1 },
			{ value: 'wall', ratio: 0 },
		];

		const selectedOptionsA = [];
		const selectedOptionsB = [];

		for (let i = 0; i < 50; i++) {
			selectedOptionsA.push(utility.selectByRatio(optionsA));
		}

		for (let i = 0; i < 50; i++) {
			selectedOptionsB.push(utility.selectByRatio(optionsB));
		}

		const everyOptionsAreDirtOrWall = selectedOptionsA.every(
			(selectedOption) => selectedOption === 'dirt' || selectedOption === 'wall'
		);

		const everyOptionsAreGrassOrDirt = selectedOptionsB.every(
			(selectedOption) =>
				selectedOption === 'grass' || selectedOption === 'dirt'
		);

		expect(everyOptionsAreDirtOrWall).toBe(true);
		expect(everyOptionsAreGrassOrDirt).toBe(true);
	});
});

describe('selectOption', () => {
	const options = [
		{
			value: 'grass',
			ratio: 0,
			override: (boolean) => boolean,
		},
		{ value: 'dirt', ratio: 1 },
		{ value: 'wall', ratio: 1 },
	];
	test('Should return override value if conditions are met', () => {
		expect(utility.selectOption(utility.selectByRatio, options, true)).toBe(
			'grass'
		);
	});

	test('Should return option by ratio if override condtions are not met', () => {
		const selectedOption = utility.selectOption(
			utility.selectByRatio,
			options,
			false
		);

		const isDirtOrWall = selectedOption === 'dirt' || selectedOption === 'wall';

		expect(isDirtOrWall).toBe(true);
	});
});
