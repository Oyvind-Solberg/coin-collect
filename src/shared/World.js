import CustomGraph from './CustomGraph';

import {
	anyConditionsAreSatisfied,
	runIterations,
	selectByRatio,
	selectOption,
} from './utility';

export default class World extends CustomGraph {
	constructor(...args) {
		super(...args);
		this.boardSize = null;
	}
	// CREATE TILES AND MODIFY TILE CONTENT

	createTiles(size) {
		this.boardSize = size;
		const tileCount = size ** 2;

		runIterations((iteration) => this.addVertex(iteration, {}), tileCount);

		return this;
	}

	addContentToTiles(contentTemplate) {
		this.forEachVertices((oldContent, tilePosition) => {
			this.setVertex(tilePosition, {
				...oldContent,
				...this._createContent(contentTemplate, tilePosition, oldContent),
			});
		});

		return this;
	}

	_createContent(contentTemplate, tilePosition, oldContent) {
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

	changeTilesContent(contentTemplate) {
		this.forEachVertices((tileContent, tilePosition) => {
			if (contentTemplate.condition(this, tilePosition, tileContent))
				this.setVertex(tilePosition, {
					...tileContent,
					...contentTemplate.content,
				});
		});

		return this;
	}

	// ADD AND REMOVE PATHS

	createPaths(checkCreatePathCondition) {
		this.forEachVertices((tileContent, tilePosition) => {
			if (!checkCreatePathCondition(tileContent)) return;

			const neighbourPositionRight = this.getNeighbouringTilePosition(
				tilePosition,
				'right'
			);
			const nighbourPositionDown = this.getNeighbouringTilePosition(
				tilePosition,
				'down'
			);

			const neighbourContentRight = this.getVertex(neighbourPositionRight);
			const neighbourContentDown = this.getVertex(nighbourPositionDown);

			if (
				typeof neighbourPositionRight === 'number' &&
				checkCreatePathCondition(neighbourContentRight)
			) {
				this.addEdge(tilePosition, neighbourPositionRight);
			}

			if (
				typeof nighbourPositionDown === 'number' &&
				checkCreatePathCondition(neighbourContentDown)
			) {
				this.addEdge(tilePosition, nighbourPositionDown);
			}
		});

		return this;
	}

	removeUnreachablePaths(playerPosition) {
		this.forEachVertices((tileContent, tilePosition) => {
			const shortestPath = this.findShortestPath(playerPosition, tilePosition);
			const unreachable =
				shortestPath.length === 1 && shortestPath[0] !== playerPosition;

			if (unreachable && this._pathToAnyNeighbourExists(tilePosition)) {
				this._removePathToNeighbour(tilePosition, 'right');
				this._removePathToNeighbour(tilePosition, 'left');
				this._removePathToNeighbour(tilePosition, 'up');
				this._removePathToNeighbour(tilePosition, 'down');
			}
		});

		return this;
	}

	_removePathToNeighbour(tilePosition, direction) {
		const neighbourPosition = this.getNeighbouringTilePosition(
			tilePosition,
			direction
		);

		if (this.hasEdge(neighbourPosition, tilePosition)) {
			this.removeEdge(neighbourPosition, tilePosition);
		}
	}

	// CONDITION CHECKING

	checkIsEdgeOfWorld(tile) {
		const lastRow = this.boardSize;
		const lastCollumn = this.boardSize;

		return anyConditionsAreSatisfied(
			this._isInRow(1, tile),
			this._isInRow(lastRow, tile),
			this._isInCollumn(1, tile),
			this._isInCollumn(lastCollumn, tile)
		);
	}

	_isInRow(rowNumber, tile) {
		const minTile = this.boardSize * rowNumber - this.boardSize;
		const maxTile = this.boardSize * rowNumber - 1;

		return tile >= minTile && tile <= maxTile;
	}

	_isInCollumn(collumnNumber, tile) {
		return (tile % this.boardSize) + 1 === collumnNumber;
	}

	_pathToAnyNeighbourExists(tilePosition) {
		const neighbourPositionUp = this.getNeighbouringTilePosition(
			tilePosition,
			'up'
		);
		const hasEdgeToUp = this.hasEdge(tilePosition, neighbourPositionUp);

		const neighbourPositionDown = this.getNeighbouringTilePosition(
			tilePosition,
			'down'
		);
		const hasEdgeToDown = this.hasEdge(tilePosition, neighbourPositionDown);

		const neighbourPositionLeft = this.getNeighbouringTilePosition(
			tilePosition,
			'left'
		);
		const hasEdgeToLeft = this.hasEdge(tilePosition, neighbourPositionLeft);

		const neighbourPositionRight = this.getNeighbouringTilePosition(
			tilePosition,
			'right'
		);
		const hasEdgeToRight = this.hasEdge(tilePosition, neighbourPositionRight);

		if (neighbourPositionUp !== null && hasEdgeToUp) return true;
		if (neighbourPositionDown !== null && hasEdgeToDown) return true;
		if (neighbourPositionLeft !== null && hasEdgeToLeft) return true;
		if (neighbourPositionRight !== null && hasEdgeToRight) return true;

		return false;
	}

	// GET POSITIONS

	getTilePositionfromDirection(direction) {
		switch (direction) {
			case 'left':
				return this.boardSize * ((this.boardSize - 1) / 2);
			case 'right':
				return this.boardSize * ((this.boardSize - 1) / 2) + this.boardSize - 1;
			case 'top':
				return (this.boardSize - 1) / 2;
			case 'bottom':
				return this.boardSize ** 2 - (this.boardSize - 1) / 2 - 1;
			default:
				throw new Error('Not a valid direction');
		}
	}

	getNeighbouringTilePosition(tilePosition, direction) {
		let position = null;
		const lastRow = this.boardSize;
		const lastCollumn = this.boardSize;

		switch (direction) {
			case 'left':
				if (!this._isInCollumn(1, tilePosition)) {
					position = tilePosition - 1;
				}
				break;

			case 'right':
				if (!this._isInCollumn(lastCollumn, tilePosition)) {
					position = tilePosition + 1;
				}
				break;
			case 'up':
				if (!this._isInRow(1, tilePosition)) {
					position = tilePosition - this.boardSize;
				}
				break;
			case 'down':
				if (!this._isInRow(lastRow, tilePosition)) {
					position = tilePosition + this.boardSize;
				}
				break;
			default:
				position = null;
				break;
		}

		return position;
	}

	getNextPositionToTarget(currentPosition, targetPosition) {
		const shortestPath = this.findShortestPath(currentPosition, targetPosition);

		if (typeof shortestPath[1] === 'number') {
			return shortestPath[1];
		} else {
			return currentPosition;
		}
	}
}
