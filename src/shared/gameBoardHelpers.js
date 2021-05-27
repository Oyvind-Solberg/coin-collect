import {
	anyConditionsAreSatisfied,
	runIterations,
	selectByRatio,
	selectOption,
} from './utility';
import _ from 'lodash';

// CREATE TILES AND MODIFY TILE CONTENT

export function createTiles(world, size) {
	const modifiedWorld = _.cloneDeep(world);
	const tileCount = size ** 2;

	runIterations(
		(iteration) => modifiedWorld.addVertex(iteration, {}),
		tileCount
	);

	return modifiedWorld;
}

export function addContentToTiles(world, contentTemplate) {
	const modifiedWorld = _.cloneDeep(world);

	modifiedWorld.forEachVertices((oldContent, tilePosition) => {
		modifiedWorld.setVertex(tilePosition, {
			...oldContent,
			...createContent(contentTemplate, tilePosition, oldContent),
		});
	});

	return modifiedWorld;
}

export function createContent(contentTemplate, tilePosition, oldContent) {
	const content = {};

	Object.entries(contentTemplate).forEach(([contentName, options]) => {
		content[contentName] = selectOption(
			selectByRatio,
			options,
			tilePosition,
			oldContent
		);
	});

	return content;
}

export function changeTilesContent(world, contentTemplate) {
	const modifiedWorld = _.cloneDeep(world);

	modifiedWorld.forEachVertices((tileContent, tilePosition) => {
		if (
			contentTemplate.condition(
				modifiedWorld,
				tilePosition,
				contentTemplate.content
			)
		)
			modifiedWorld.setVertex(tilePosition, {
				...tileContent,
				...contentTemplate.content,
			});
	});

	return modifiedWorld;
}

// ADD AND REMOVE PATHS

export function createPaths(world, checkCreatePathCondition) {
	const modifiedWorld = _.cloneDeep(world);
	const size = Math.sqrt(world.getVerticesCount());

	modifiedWorld.forEachVertices((tileContent, tilePosition) => {
		if (!checkCreatePathCondition(tileContent)) return;

		const neighbourPositionRight = getNeighbouringTilePosition(
			size,
			tilePosition,
			'right'
		);
		const nighbourPositionDown = getNeighbouringTilePosition(
			size,
			tilePosition,
			'down'
		);

		const neighbourContentRight = modifiedWorld.getVertex(
			neighbourPositionRight
		);
		const neighbourContentDown = modifiedWorld.getVertex(nighbourPositionDown);

		if (
			typeof neighbourPositionRight === 'number' &&
			checkCreatePathCondition(neighbourContentRight)
		) {
			modifiedWorld.addEdge(tilePosition, neighbourPositionRight);
		}

		if (
			typeof nighbourPositionDown === 'number' &&
			checkCreatePathCondition(neighbourContentDown)
		) {
			modifiedWorld.addEdge(tilePosition, nighbourPositionDown);
		}
	});

	return modifiedWorld;
}

export function removeUnreachablePaths(world, playerPosition) {
	const modifiedWorld = _.cloneDeep(world);

	modifiedWorld.forEachVertices((tileContent, tilePosition) => {
		const shortestPath = modifiedWorld.findShortestPath(
			playerPosition,
			tilePosition
		);
		const unreachable =
			shortestPath.length === 1 && shortestPath[0] !== playerPosition;

		if (unreachable && pathToAnyNeighbourExists(modifiedWorld, tilePosition)) {
			removePathToNeighbour(modifiedWorld, tilePosition, 'right');
			removePathToNeighbour(modifiedWorld, tilePosition, 'left');
			removePathToNeighbour(modifiedWorld, tilePosition, 'up');
			removePathToNeighbour(modifiedWorld, tilePosition, 'down');
		}
	});

	return modifiedWorld;
}

export function removePathToNeighbour(world, tilePosition, direction) {
	const size = Math.sqrt(world.getVerticesCount());
	const neighbourPosition = getNeighbouringTilePosition(
		size,
		tilePosition,
		direction
	);

	if (world.hasEdge(neighbourPosition, tilePosition)) {
		world.removeEdge(neighbourPosition, tilePosition);
	}
}

// CONDITION CHECKING

export function checkIsEdgeOfWorld(tile, size) {
	const lastRow = size;
	const lastCollumn = size;

	return anyConditionsAreSatisfied(
		isInRow(1, tile, size),
		isInRow(lastRow, tile, size),
		isInCollumn(1, tile, size),
		isInCollumn(lastCollumn, tile, size)
	);
}

export function isInRow(rowNumber, tile, size) {
	const minTile = size * rowNumber - size;
	const maxTile = size * rowNumber - 1;

	return tile >= minTile && tile <= maxTile;
}

export function isInCollumn(collumnNumber, tile, size) {
	return (tile % size) + 1 === collumnNumber;
}

export function pathToAnyNeighbourExists(world, tilePosition) {
	const size = Math.sqrt(world.getVerticesCount());
	const neighbourPositionUp = getNeighbouringTilePosition(
		size,
		tilePosition,
		'up'
	);
	const hasEdgeToUp = world.hasEdge(tilePosition, neighbourPositionUp);

	const neighbourPositionDown = getNeighbouringTilePosition(
		size,
		tilePosition,
		'down'
	);
	const hasEdgeToDown = world.hasEdge(tilePosition, neighbourPositionDown);

	const neighbourPositionLeft = getNeighbouringTilePosition(
		size,
		tilePosition,
		'left'
	);
	const hasEdgeToLeft = world.hasEdge(tilePosition, neighbourPositionLeft);

	const neighbourPositionRight = getNeighbouringTilePosition(
		size,
		tilePosition,
		'right'
	);
	const hasEdgeToRight = world.hasEdge(tilePosition, neighbourPositionRight);

	if (neighbourPositionUp !== null && hasEdgeToUp) return true;
	if (neighbourPositionDown !== null && hasEdgeToDown) return true;
	if (neighbourPositionLeft !== null && hasEdgeToLeft) return true;
	if (neighbourPositionRight !== null && hasEdgeToRight) return true;

	return false;
}

// GET POSITIONS

export function getTilePositionfromDirection(boardSize, direction) {
	switch (direction) {
		case 'left':
			return boardSize * ((boardSize - 1) / 2);
		case 'right':
			return boardSize * ((boardSize - 1) / 2) + boardSize - 1;
		case 'top':
			return (boardSize - 1) / 2;
		case 'bottom':
			return boardSize ** 2 - (boardSize - 1) / 2 - 1;
		default:
			throw new Error('Not a valid direction');
	}
}

export function getNeighbouringTilePosition(size, tilePosition, direction) {
	let position = null;
	const lastRow = size;
	const lastCollumn = size;

	switch (direction) {
		case 'left':
			if (!isInCollumn(1, tilePosition, size)) {
				position = tilePosition - 1;
			}
			break;

		case 'right':
			if (!isInCollumn(lastCollumn, tilePosition, size)) {
				position = tilePosition + 1;
			}
			break;
		case 'up':
			if (!isInRow(1, tilePosition, size)) {
				position = tilePosition - size;
			}
			break;
		case 'down':
			if (!isInRow(lastRow, tilePosition, size)) {
				position = tilePosition + size;
			}
			break;
		default:
			position = null;
			break;
	}

	return position;
}

export function getNextPositionToTarget(
	world,
	currentPosition,
	targetPosition
) {
	const shortestPath = world.findShortestPath(currentPosition, targetPosition);

	return shortestPath[1];
}
