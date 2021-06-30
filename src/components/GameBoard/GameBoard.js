import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tiles from './Tiles/Tiles';
import Scoreboard from './Scoreboard/Scoreboard';

const useStyles = makeStyles((theme) => ({
	container: {
		marginTop: '0.5rem',
		borderRadius: '5px',
		width: (props) => props.boardSize,
		margin: 'auto',
		// border: '1px solid #333',
		overflow: 'hidden',
	},
}));

function GameBoard(props) {
	const classes = useStyles(props);

	return (
		<Paper elevation={3} className={classes.container}>
			<Scoreboard score={props.score} />
			<Tiles
				tiles={props.tiles}
				size={props.size}
				boardSize={props.boardSize}
			/>
		</Paper>
	);
}

export default GameBoard;
