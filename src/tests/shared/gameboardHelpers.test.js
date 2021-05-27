import * as gameboardHelpers from '../../shared/gameboardHelpers';
import * as utility from '../../shared/utility';

describe('Gameboard Helpers', () => {
	let emptyWorld;
	let world;
	const checkCreatePathCondition = (content) => content.terrain !== 'wall';

	beforeEach(() => {
		emptyWorld = new utility.CustomGraph();
		world = gameboardHelpers.createTiles(emptyWorld, 5);
	});

	describe('createTiles', () => {
		test('Should return world with right amount of tiles', () => {
			expect(world.getVerticesCount()).toBe(25);
		});
	});

	describe('createContent', () => {
		test('Should return created content', () => {
			expect(
				gameboardHelpers.createContent({
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
			const worldWithContentOverride = gameboardHelpers.addContentToTiles(
				world,
				{
					terrain: [
						{ value: 'dirt', ratio: 1 },
						{
							value: 'wall',
							ratio: 0,
							override: (tilePosition) => tilePosition === 10,
						},
					],
				}
			);
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
			const worldWithChangedContent = gameboardHelpers.changeTilesContent(
				world,
				{
					content: { terrain: 'wall' },
					condition: (world, tilePosition, content) => tilePosition === 10,
				}
			);
			expect(worldWithChangedContent.getVertex(10)).toEqual({
				terrain: 'wall',
			});

			expect(worldWithChangedContent.getVertex(9)).toEqual({});
		});
	});

	describe('createPaths', () => {
		test('Should return world with paths', () => {
			const worldWithPaths = gameboardHelpers.createPaths(
				world,
				checkCreatePathCondition
			);
			expect(worldWithPaths.getEdgesCount()).toBe(40);
		});

		test('Should not add path to tiles with terrain set to wall', () => {
			world.setVertex(12, { terrain: 'wall' });
			const worldWithPaths = gameboardHelpers.createPaths(
				world,
				checkCreatePathCondition
			);
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

			const worldWithPaths = gameboardHelpers.createPaths(
				world,
				checkCreatePathCondition
			);

			const worldWithRemovedUnreachablePaths =
				gameboardHelpers.removeUnreachablePaths(worldWithPaths, 10);

			expect(worldWithRemovedUnreachablePaths.hasEdge(4, 9)).toBe(false);
			expect(worldWithRemovedUnreachablePaths.getEdgesCount()).toBe(28);
		});
	});

	describe('removePathToNeighbour', () => {
		test('Should remove neighbour tile path', () => {
			const worldWithPaths = gameboardHelpers.createPaths(
				world,
				checkCreatePathCondition
			);

			gameboardHelpers.removePathToNeighbour(worldWithPaths, 12, 'right');
			expect(worldWithPaths.hasEdge(12, 13)).toBe(false);
			expect(worldWithPaths.getEdgesCount()).toBe(39);

			gameboardHelpers.removePathToNeighbour(worldWithPaths, 12, 'left');
			expect(worldWithPaths.hasEdge(12, 11)).toBe(false);
			expect(worldWithPaths.getEdgesCount()).toBe(38);

			gameboardHelpers.removePathToNeighbour(worldWithPaths, 12, 'up');
			expect(worldWithPaths.hasEdge(12, 7)).toBe(false);
			expect(worldWithPaths.getEdgesCount()).toBe(37);

			gameboardHelpers.removePathToNeighbour(worldWithPaths, 12, 'down');
			expect(worldWithPaths.hasEdge(12, 17)).toBe(false);
			expect(worldWithPaths.getEdgesCount()).toBe(36);

			gameboardHelpers.removePathToNeighbour(worldWithPaths, 21, 'down');
			expect(worldWithPaths.getEdgesCount()).toBe(36);
		});
	});

	describe('checkIsEdgeOfWorld', () => {
		test('Should check tiles', () => {
			expect(gameboardHelpers.checkIsEdgeOfWorld(14, 5)).toBe(true);
			expect(gameboardHelpers.checkIsEdgeOfWorld(2, 5)).toBe(true);
			expect(gameboardHelpers.checkIsEdgeOfWorld(24, 5)).toBe(true);
			expect(gameboardHelpers.checkIsEdgeOfWorld(15, 5)).toBe(true);
			expect(gameboardHelpers.checkIsEdgeOfWorld(21, 5)).toBe(true);
			expect(gameboardHelpers.checkIsEdgeOfWorld(16, 5)).toBe(false);
		});
	});

	describe('isInRow', () => {
		test('Should check tiles', () => {
			expect(gameboardHelpers.isInRow(1, 2, 5)).toBe(true);
			expect(gameboardHelpers.isInRow(2, 18, 5)).toBe(false);
			expect(gameboardHelpers.isInRow(1, 8, 5)).toBe(false);
			expect(gameboardHelpers.isInRow(4, 18, 5)).toBe(true);
		});
	});

	describe('isInCollumn', () => {
		test('Should check tiles', () => {
			expect(gameboardHelpers.isInCollumn(1, 5, 5)).toBe(true);
			expect(gameboardHelpers.isInCollumn(2, 18, 5)).toBe(false);
			expect(gameboardHelpers.isInCollumn(1, 7, 5)).toBe(false);
			expect(gameboardHelpers.isInCollumn(4, 18, 5)).toBe(true);
		});
	});

	describe('getTilePositionfromDirection', () => {
		test('Should return the right tile position', () => {
			expect(gameboardHelpers.getTilePositionfromDirection(5, 'top')).toBe(2);
			expect(gameboardHelpers.getTilePositionfromDirection(5, 'left')).toBe(10);
			expect(gameboardHelpers.getTilePositionfromDirection(5, 'right')).toBe(
				14
			);
			expect(gameboardHelpers.getTilePositionfromDirection(5, 'bottom')).toBe(
				22
			);
		});
	});

	describe('getNeighbouringTilePosition', () => {
		test('Should return the right tile position', () => {
			expect(gameboardHelpers.getNeighbouringTilePosition(5, 7, 'up')).toBe(2);
			expect(gameboardHelpers.getNeighbouringTilePosition(5, 2, 'up')).toBe(
				null
			);
			expect(gameboardHelpers.getNeighbouringTilePosition(5, 11, 'left')).toBe(
				10
			);
			expect(gameboardHelpers.getNeighbouringTilePosition(5, 17, 'right')).toBe(
				18
			);
			expect(gameboardHelpers.getNeighbouringTilePosition(5, 6, 'down')).toBe(
				11
			);
		});
	});
});
