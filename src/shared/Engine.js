import {
	anyConditionsAreSatisfied,
	allConditionsAreSatisfied,
	anyValuesMatches,
} from './utility';

import World from './World';

export default class Engine {
	constructor(setWorld, setGame, setUser) {
		this._setWorld = setWorld;
		this._setGame = setGame;
		this._setUser = setUser;

		this._world = null;
		this._worldTiles = null;
		this._worldSize = null;
		this._gameStage = null;
		this._gameVictory = null;
		this._gameSpeed = null;
		this._gameSpeedMultiplier = null;
		this._gameID = null;

		this._playerPositions = {
			human: null,
			AI: null,
		};

		this._user = {
			name: null,
			score: 0,
		};

		this._coins = {
			total: null,
			collected: 0,
		};
	}

	_runGame(runActions) {
		const run = (speed) => {
			if (this._gameStage === 'playing') {
				runActions();
				const newSpeed = speed * this._gameSpeedMultiplier;
				this._gameID = setTimeout(() => run(newSpeed), speed);
			}
		};

		this._gameID = setTimeout(() => run(this._gameSpeed), this._gameSpeed);
	}

	_killGame() {
		clearTimeout(this._gameID);
		this._gameID = null;
		this._gameStage = null;
	}

	startNewGame(userName, size, difficultyLevel) {
		if (this._gameID) this._killGame();

		this._user.name = userName;
		this._user.score = 0;
		this._coins.collected = 0;
		this._worldSize = size;
		this._gameStage = 'playing';

		switch (difficultyLevel) {
			case 'easy':
				this._gameSpeed = 2000;
				this._gameSpeedMultiplier = 0.999;
				break;
			case 'normal':
				this._gameSpeed = 1500;
				this._gameSpeedMultiplier = 0.98;
				break;
			case 'hard':
				this._gameSpeed = 1000;
				this._gameSpeedMultiplier = 0.97;
				break;

			default:
				break;
		}

		this._buildWorld();
		this._updateView();

		this._runGame(() => {
			this._moveAIPlayer();
			this._checkGameConditions();
			this._updateView();
		});
	}

	_buildWorld() {
		this._world = new World();
		this._world.createTiles(this._worldSize);
		this._playerPositions.human =
			this._world.getTilePositionfromDirection('left');
		this._playerPositions.AI =
			this._world.getTilePositionfromDirection('right');

		const addTerrainTemplate = {
			terrain: [
				{
					value: 'grass',
					ratio: 1,
					override: (tilePosition) =>
						this._world.checkIsEdgeOfWorld(tilePosition, this._worldSize),
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
						return anyConditionsAreSatisfied(
							content.terrain === 'wall',
							anyValuesMatches(this._playerPositions, tilePosition)
						);
					},
				},
			],
		};

		const addPlayersObjectTemplate = {
			players: [{ value: { human: false, AI: false }, ratio: 1 }],
		};

		const addHumanPlayerTemplate = {
			content: { players: { human: true, AI: false } },
			condition: (world, tilePosition, content) =>
				this._playerPositions.human === tilePosition,
		};

		const addAIPlayerTemplate = {
			content: { players: { human: false, AI: true } },
			condition: (world, tilePosition, content) =>
				this._playerPositions.AI === tilePosition,
		};

		const addPassableTemplate = {
			passable: [
				{ value: true, ratio: 1 },
				{
					value: false,
					ratio: 0,
					override: (tilePosition, content) => content.terrain === 'wall',
				},
			],
		};

		this._world
			.addContentToTiles(addTerrainTemplate)
			.createPaths((content) => content.terrain !== 'wall')
			.removeUnreachablePaths(this._playerPositions.human)
			.changeTilesContent(changeUnreachableToWallTemplate)
			.addContentToTiles(addItemsTemplate)
			.addContentToTiles(addPassableTemplate)
			.addContentToTiles(addPlayersObjectTemplate)
			.changeTilesContent(addHumanPlayerTemplate)
			.changeTilesContent(addAIPlayerTemplate);

		this._worldTiles = this._world.getValuesFromAllVertices();
		this._coins.total = this._world.countMatches(
			(content) => content.item === 'coin'
		);
	}

	_moveAIPlayer() {
		const oldAIPosition = this._playerPositions.AI;
		const newAIPosition = this._world.getNextPositionToTarget(
			oldAIPosition,
			this._playerPositions.human
		);
		this._playerPositions.AI = newAIPosition;

		this._worldTiles[oldAIPosition].players = {
			...this._worldTiles[oldAIPosition].players,
			AI: false,
		};
		this._worldTiles[newAIPosition].players = {
			...this._worldTiles[oldAIPosition].players,
			AI: true,
		};
	}

	moveHumanPlayer(direction) {
		if (this._gameStage !== 'playing') return;

		const oldHumanPosition = this._playerPositions.human;
		const newHumanPosition = this._world.getNeighbouringTilePosition(
			oldHumanPosition,
			direction
		);

		if (
			typeof newHumanPosition !== 'number' ||
			this._worldTiles[newHumanPosition].passable === false
		) {
			return;
		}

		this._playerPositions.human = newHumanPosition;
		this._worldTiles[oldHumanPosition].players = {
			...this._worldTiles[oldHumanPosition].players,
			human: false,
		};
		this._worldTiles[newHumanPosition].players = {
			...this._worldTiles[newHumanPosition].players,
			human: true,
		};

		const coinOnNewHumanPlayerPosition =
			this._worldTiles[newHumanPosition].item === 'coin';

		if (coinOnNewHumanPlayerPosition) {
			this._worldTiles[newHumanPosition].item = false;
			this._coins.collected += 1;
			this._user.score += 100;
		}

		this._checkGameConditions();
		this._updateView();
	}

	_checkGameConditions() {
		if (
			anyConditionsAreSatisfied(
				this._playerPositions.human === this._playerPositions.AI
			)
		) {
			this._gameStage = 'summary';
			this._gameVictory = false;
		} else if (
			allConditionsAreSatisfied(this._coins.collected === this._coins.total)
		) {
			this._gameStage = 'summary';
			this._gameVictory = true;
		}
	}

	_updateView() {
		this._setWorld({ tiles: this._worldTiles, size: this._worldSize });
		this._setGame({
			stage: this._gameStage,
			victory: this._gameVictory,
			coins: this._coins,
		});
		this._setUser({ ...this._user });
	}
}
