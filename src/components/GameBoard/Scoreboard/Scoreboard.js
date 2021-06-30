import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
	container: {
		backgroundColor: '#333',
		color: 'white',
		padding: '0.5rem 0 0.5rem 0',
	},
}));

function Scoreboard(props) {
	const classes = useStyles(props);

	return (
		<div className={classes.container}>
			<Typography align="center" variant="body1">
				SCORE: {props.score}
			</Typography>
		</div>
	);
}

export default Scoreboard;
