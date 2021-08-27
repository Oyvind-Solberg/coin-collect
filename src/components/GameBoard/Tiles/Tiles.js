import { makeStyles } from '@material-ui/core/styles';
import dirtImage from '../../../assets/images/dirt.png';
import grassImage from '../../../assets/images/grass.png';
import wallImage from '../../../assets/images/wall.png';
import coinImage from '../../../assets/images/coin.png';
import humanPlayerImage from '../../../assets/images/human_player.png';
import AIPlayerImage from '../../../assets/images/AI_player.png';

const useStyles = makeStyles((theme) => ({
	tilesContainer: {
		display: 'grid',
		gridTemplateColumns: (props) => `repeat(${props.size}, 1fr)`,
		gridTemplateRows: (props) => `repeat(${props.size}, 1fr)`,
		height: (props) => props.boardSize,
		width: (props) => props.boardSize,
		textAlign: 'center',
		backgroundColor: theme.palette.primary.main,
		border: `1px solid ${theme.palette.primary.main}`,
	},
	tile: { position: 'relative' },
	layer: {
		backgroundPosition: 'center',
		backgroundSize: 'contain',
		backgroundRepeat: 'no-repeat',

		width: '100%',
		height: '100%',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
	},
	item: {
		backgroundImage: `url(${coinImage})`,
		width: '30%',
		height: '30%',
		zIndex: '4',
		filter: 'drop-shadow(-5px 15px 10px rgba(0, 0, 0, 0.8))',
		// backgroundColor: theme.palette.secondary.main,
	},
	AIPlayer: {
		backgroundImage: `url(${AIPlayerImage})`,
		zIndex: '5',
	},
	humanPlayer: {
		backgroundImage: `url(${humanPlayerImage})`,
		zIndex: '3',
	},
	grass: {
		backgroundImage: `url(${grassImage})`,
		zIndex: '1',
		// backgroundColor: theme.palette.primary.main,
	},
	dirt: {
		backgroundImage: `url(${dirtImage})`,
		zIndex: '1',
		// backgroundColor: theme.palette.primary.light,
	},
	wall: {
		backgroundImage: `url(${wallImage})`,
		zIndex: '2',
		boxShadow: '-5px 5px 10px rgba(0, 0, 0, 0.8)',
		// backgroundColor: theme.palette.tertiary.main,
	},
}));

function Tiles(props) {
	const classes = useStyles(props);

	const tiles = Object.keys(props.tiles).map((tilePosition) => {
		let item = null;
		let player = null;
		let terrain = null;
		let content = props.tiles[tilePosition];

		if (content.item === 'coin') {
			item = <div className={`${classes.layer} ${classes.item}`}></div>;
		}

		if (content.players.AI) {
			player = <div className={`${classes.layer} ${classes.AIPlayer}`}></div>;
		} else if (content.players.human) {
			player = (
				<div className={`${classes.layer} ${classes.humanPlayer}`}></div>
			);
		}

		if (content.terrain === 'grass') {
			terrain = <div className={`${classes.layer} ${classes.grass}`}></div>;
		} else if (content.terrain === 'dirt') {
			terrain = <div className={`${classes.layer} ${classes.dirt}`}></div>;
		} else if (content.terrain === 'wall') {
			terrain = <div className={`${classes.layer} ${classes.wall}`}></div>;
		}

		return (
			<div key={tilePosition} className={classes.tile}>
				{item}
				{player}
				{terrain}
			</div>
		);
	});

	return <div className={classes.tilesContainer}>{tiles}</div>;
}

export default Tiles;
