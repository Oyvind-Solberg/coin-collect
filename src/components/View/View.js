import { useState, useEffect, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SimpleModal from '../UI/SimpleModal/SimpleModal';
import HighScore from '../modalContent/HigeScore/HighScore';
import Instructions from '../modalContent/Instructions/Instructions';
import GameSetup from '../modalContent/GameSetup/GameSetup';
import GameSummary from '../modalContent/GameSummary/GameSummary';
import GameBoard from '../Gameboard/Gameboard';
import PlayerControlls from '../UI/PlayerControlls/PlayerControlls';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Buttons from '../UI/Buttons/Buttons';
import Logo from '../UI/Logo/Logo';
import logoImage from '../../assets/images/logo.png';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		padding: '0.2rem 0 0 0',
		height: '100vh',
		width: '100vw',
		[theme.breakpoints.up('sm')]: {
			padding: '1rem 0 4rem 0',
		},
	},
	gameWindow: {
		width: '90vw',
		margin: 'auto',
		[theme.breakpoints.up('sm')]: {
			width: '600px',
		},
	},
}));

function View(props) {
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
	let boardSize = isDesktop ? '600px' : '90vw';

	const classes = useStyles();
	const [game, setGame] = props.gameState;
	const [modal, setModal] = useState({
		isOpen: true,
		componentName: 'Instructions',
	});
	const openModal = useCallback((componentName) => {
		setModal({
			isOpen: true,
			componentName,
		});
	}, []);

	const closeModal = useCallback(() => {
		setModal({
			isOpen: false,
			componentName: null,
		});
	}, []);

	useEffect(() => {
		if (game.stage && game.stage === 'summary') {
			openModal('GameSummary');
		}
	}, [game, setGame, openModal]);

	return (
		<main className={classes.container}>
			<Logo image={logoImage} />
			<SimpleModal modal={modal} closeModal={closeModal}>
				{modal.componentName === 'HighScore' ? (
					<HighScore highScore={props.highScore} />
				) : null}
				{modal.componentName === 'Instructions' ? <Instructions /> : null}
				{modal.componentName === 'GameSetup' ? (
					<GameSetup
						startNewGame={props.startNewGame}
						closeModal={closeModal}
					/>
				) : null}
				{modal.componentName === 'GameSummary' ? (
					<GameSummary victory={game.victory} user={props.user} />
				) : null}
			</SimpleModal>
			<div className={classes.gameWindow}>
				<Buttons openModal={openModal} />
				{props.worldTiles ? (
					<GameBoard
						score={props.user.score}
						tiles={props.worldTiles}
						size={props.worldSize}
						boardSize={boardSize}
					/>
				) : null}
			</div>
			{isDesktop ? null : (
				<PlayerControlls moveHumanPlayer={props.moveHumanPlayer} />
			)}
		</main>
	);
}

export default View;
