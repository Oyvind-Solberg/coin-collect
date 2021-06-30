import Engine from './shared/Engine';
import { useState, useEffect, useCallback } from 'react';
import { useEvent } from './hooks/index';
import View from './components/View/View';

function App() {
	const [GameEngine, setGameEngine] = useState(null);

	const [world, setWorld] = useState({
		tiles: null,
		size: null,
	});
	const [game, setGame] = useState({
		stage: null,
		victory: null,
	});

	const [highScore, setHighScore] = useState([
		{ user: 'Kari', score: 10000 },
		{ user: 'Per', score: 8000 },
		{ user: 'Anne', score: 6000 },
		{ user: 'Ole', score: 4000 },
	]);
	const [settings, setSettings] = useState({ soundOn: true });
	const [user, setUser] = useState({
		name: null,
		score: null,
	});

	const startNewGame = (userName, size, difficultyLevel) => {
		GameEngine.startNewGame(userName, size, difficultyLevel);
	};

	const moveHumanPlayer = useCallback(
		(direction) => {
			GameEngine.moveHumanPlayer(direction);
		},
		[GameEngine]
	);

	const handleKeyPressed = useCallback(
		(event) => {
			const key = event.key;

			switch (key) {
				case 'ArrowLeft':
					moveHumanPlayer('left');
					break;
				case 'ArrowRight':
					moveHumanPlayer('right');
					break;
				case 'ArrowUp':
					moveHumanPlayer('up');
					break;
				case 'ArrowDown':
					moveHumanPlayer('down');
					break;
				default:
					return;
			}
		},
		[moveHumanPlayer]
	);

	// useEvent('onkeydown', handleKeyPressed);

	useEffect(() => {
		if (!GameEngine) {
			setGameEngine(new Engine(setWorld, setGame, setUser));
		}
	}, []);

	useEffect(() => {
		window.onkeydown = handleKeyPressed;
	}, [handleKeyPressed]);

	return (
		<View
			gameState={[game, setGame]}
			highScore={highScore}
			user={user}
			startNewGame={startNewGame}
			moveHumanPlayer={moveHumanPlayer}
			worldTiles={world.tiles}
			worldSize={world.size}
		/>
	);
}

export default App;
