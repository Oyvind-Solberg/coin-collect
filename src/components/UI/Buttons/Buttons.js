import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ScoreIcon from '@material-ui/icons/Score';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	button: {
		// margin: theme.spacing(1),
		borderRadius: '20px',
	},
}));

function Buttons(props) {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<ButtonGroup
				className={classes.button}
				variant="contained"
				color="primary"
			>
				<Button
					className={classes.button}
					onClick={() => props.openModal('GameSetup')}
					startIcon={<AddCircleOutlineIcon />}
				>
					New game
				</Button>
				<Button
					className={classes.button}
					onClick={() => props.openModal('HighScore')}
					startIcon={<ScoreIcon />}
				>
					High score
				</Button>
			</ButtonGroup>

			<ButtonGroup
				className={classes.button}
				variant="contained"
				color="primary"
			>
				<Button className={classes.button} aria-label="Toggle sound">
					<VolumeUpIcon />
				</Button>
				<Button
					className={classes.button}
					onClick={() => props.openModal('Instructions')}
					aria-label="Instructions"
				>
					<HelpOutlineIcon />
				</Button>
			</ButtonGroup>
		</div>
	);
}

export default Buttons;
