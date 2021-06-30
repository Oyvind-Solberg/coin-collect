import World from '../../shared/World';

describe('World', () => {
	let emptyWorld;
	let world;
	const checkCreatePathCondition = (content) => content.terrain !== 'wall';

	beforeEach(() => {
		emptyWorld = new World();
		world = new World();
		world.createTiles(5);
	});

	describe('createTiles', () => {
		test('Should return world with right amount of tiles', () => {
			expect(world.getVerticesCount()).toBe(25);
		});
	});

	describe('createContent', () => {
		test('Should return created content', () => {
			expect(
				emptyWorld._createContent({
					terrain: [
						{ value: 'dirt', ratio: 1 },
						{ value: 'wall', ratio: 0 },
					],
				})
			).toEqual({ terrain: 'dirt' });
		});
	});

	describe('addContentToTiles', () => {
		test('Should return world with added content to tiles', () => {
			const worldWithContentOverride = world.addContentToTiles({
				terrain: [
					{ value: 'dirt', ratio: 1 },
					{
						value: 'wall',
						ratio: 0,
						override: (tilePosition) => tilePosition === 10,
					},
				],
			});
			expect(worldWithContentOverride.getVertex(10)).toEqual({
				terrain: 'wall',
			});
			expect(worldWithContentOverride.getVertex(9)).toEqual({
				terrain: 'dirt',
			});
		});
	});

	describe('changeTilesContent', () => {
		test('Should return world with added content to tiles', () => {
			const worldWithChangedContent = new World();
			worldWithChangedContent.createTiles(5);
			worldWithChangedContent.setVertex(10, { terrain: 'grass' });
			worldWithChangedContent.setVertex(8, { terrain: 'dirt' });
			worldWithChangedContent.changeTilesContent({
				content: { terrain: 'wall' },
				condition: (world, tilePosition, content) => tilePosition === 10,
			});

			expect(worldWithChangedContent.getVertex(10)).toEqual({
				terrain: 'wall',
			});

			expect(worldWithChangedContent.getVertex(9)).toEqual({});

			const worldWithChangedContent2 = new World();
			worldWithChangedContent2.createTiles(5);
			worldWithChangedContent2.setVertex(10, { terrain: 'grass' });
			worldWithChangedContent2.setVertex(8, { terrain: 'dirt' });
			worldWithChangedContent2.changeTilesContent({
				content: { terrain: 'wall' },
				condition: (world, tilePosition, content) => content.terrain === 'dirt',
			});

			expect(worldWithChangedContent2.getVertex(8)).toEqual({
				terrain: 'wall',
			});
		});
	});

	describe('createPaths', () => {
		test('Should return world with paths', () => {
			const worldWithPaths = world.createPaths(checkCreatePathCondition);
			expect(worldWithPaths.getEdgesCount()).toBe(40);
		});

		test('Should not add path to tiles with terrain set to wall', () => {
			world.setVertex(12, { terrain: 'wall' });
			const worldWithPaths = world.createPaths(checkCreatePathCondition);
			expect(worldWithPaths.getEdgesCount()).toBe(36);
		});
	});

	describe('removeUnreachablePaths', () => {
		test('Should remove unreachable paths', () => {
			const wallContent = { terrain: 'wall' };

			world.setVertex(3, wallContent);
			world.setVertex(8, wallContent);
			world.setVertex(13, wallContent);
			world.setVertex(14, wallContent);
			world.createPaths(checkCreatePathCondition);
			world.removeUnreachablePaths(10);

			expect(world.hasEdge(4, 9)).toBe(false);
			expect(world.getEdgesCount()).toBe(28);
		});
	});

	describe('removePathToNeighbour', () => {
		test('Should remove neighbour tile path', () => {
			world.createPaths(checkCreatePathCondition);

			world._removePathToNeighbour(12, 'right');
			expect(world.hasEdge(12, 13)).toBe(false);
			expect(world.getEdgesCount()).toBe(39);

			world._removePathToNeighbour(12, 'left');
			expect(world.hasEdge(12, 11)).toBe(false);
			expect(world.getEdgesCount()).toBe(38);

			world._removePathToNeighbour(12, 'up');
			expect(world.hasEdge(12, 7)).toBe(false);
			expect(world.getEdgesCount()).toBe(37);

			world._removePathToNeighbour(12, 'down');
			expect(world.hasEdge(12, 17)).toBe(false);
			expect(world.getEdgesCount()).toBe(36);

			world._removePathToNeighbour(21, 'down');
			expect(world.getEdgesCount()).toBe(36);
		});
	});

	describe('checkIsEdgeOfWorld', () => {
		test('Should check tiles', () => {
			expect(world.checkIsEdgeOfWorld(14, 5)).toBe(true);
			expect(world.checkIsEdgeOfWorld(2, 5)).toBe(true);
			expect(world.checkIsEdgeOfWorld(24, 5)).toBe(true);
			expect(world.checkIsEdgeOfWorld(15, 5)).toBe(true);
			expect(world.checkIsEdgeOfWorld(21, 5)).toBe(true);
			expect(world.checkIsEdgeOfWorld(16, 5)).toBe(false);
		});
	});

	describe('isInRow', () => {
		test('Should check tiles', () => {
			expect(world._isInRow(1, 2, 5)).toBe(true);
			expect(world._isInRow(2, 18, 5)).toBe(false);
			expect(world._isInRow(1, 8, 5)).toBe(false);
			expect(world._isInRow(4, 18, 5)).toBe(true);
		});
	});

	describe('isInCollumn', () => {
		test('Should check tiles', () => {
			expect(world._isInCollumn(1, 5, 5)).toBe(true);
			expect(world._isInCollumn(2, 18, 5)).toBe(false);
			expect(world._isInCollumn(1, 7, 5)).toBe(false);
			expect(world._isInCollumn(4, 18, 5)).toBe(true);
		});
	});

	describe('getTilePositionfromDirection', () => {
		test('Should return the right tile position', () => {
			expect(world.getTilePositionfromDirection('top')).toBe(2);
			expect(world.getTilePositionfromDirection('left')).toBe(10);
			expect(world.getTilePositionfromDirection('right')).toBe(14);
			expect(world.getTilePositionfromDirection('bottom')).toBe(22);
		});
	});

	describe('getNeighbouringTilePosition', () => {
		test('Should return the right tile position', () => {
			expect(world.getNeighbouringTilePosition(7, 'up')).toBe(2);
			expect(world.getNeighbouringTilePosition(2, 'up')).toBe(null);
			expect(world.getNeighbouringTilePosition(11, 'left')).toBe(10);
			expect(world.getNeighbouringTilePosition(17, 'right')).toBe(18);
			expect(world.getNeighbouringTilePosition(6, 'down')).toBe(11);
		});
	});
});
