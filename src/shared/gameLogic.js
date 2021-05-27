import {
	anyConditionsAreSatisfied,
	allConditionsAreSatisfied,
	anyValuesMatches,
	CustomGraph,
} from './utility';

import {
	checkIsEdgeOfWorld,
	createTiles,
	addContentToTiles,
	createPaths,
	removeUnreachablePaths,
	changeTilesContent,
} from './gameboardHelpers';

export function buildWorld(size, playerPositions) {
	const addTerrainTemplate = {
		terrain: [
			{
				value: 'grass',
				ratio: 1,
				override: (tilePosition) => checkIsEdgeOfWorld(tilePosition, size),
			},
			{ value: 'dirt', ratio: 1 },
			{ value: 'wall', ratio: 1 },
		],
	};

	const changeUnreachableToWallTemplate = {
		content: { terrain: 'wall' },
		condition: (world, tilePosition, content) => {
			return allConditionsAreSatisfied(
				content.terrain !== 'wall',
				world.vertexHasEdges(tilePosition) === false
			);
		},
	};

	const addItemsTemplate = {
		item: [
			{ value: 'coin', ratio: 1 },
			{
				value: null,
				ratio: 0,
				override: (tilePosition, content) => {
					anyConditionsAreSatisfied(
						content.terrain === 'wall',
						anyValuesMatches(playerPositions, tilePosition)
					);
				},
			},
		],
	};

	const addPassableTemplate = {
		passable: [
			{ value: true, ratio: 1 },
			{
				value: false,
				ratio: 0,
				override: (tilePosition, content) => {
					anyConditionsAreSatisfied(content.terrain === 'wall');
				},
			},
		],
	};

	const emptyWorld = new CustomGraph();

	const worldPass1 = createTiles(emptyWorld, size);
	const worldPass2 = addContentToTiles(worldPass1, addTerrainTemplate);
	const worldPass3 = createPaths(
		worldPass2,
		(content) => content.terrain !== 'wall'
	);
	const worldPass4 = removeUnreachablePaths(worldPass3, playerPositions.human);
	const worldPass5 = changeTilesContent(
		worldPass4,
		changeUnreachableToWallTemplate
	);
	const worldPass6 = addContentToTiles(worldPass5, addItemsTemplate);
	const worldPass7 = addContentToTiles(worldPass6, addPassableTemplate);

	return worldPass7;
}

export function getGameStatus(game, players) {
	if (
		anyConditionsAreSatisfied(players.human.position === players.AI.position)
	) {
		return { stage: 'summary', victory: false };
	} else if (
		allConditionsAreSatisfied(game.coins.collected === game.coins.total)
	) {
		return { stage: 'summary', victory: true };
	} else return {};
}
