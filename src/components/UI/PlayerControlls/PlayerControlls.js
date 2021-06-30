import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const ControllButton = withStyles({
	root: {
		position: 'absolute',
	},
})(IconButton);

const useStyles = makeStyles((theme) => ({
	buttonGroup: {
		position: 'absolute',
		bottom: '0',
		right: '0',
		width: '150px',
		height: '150px',
		border: `1px solid ${theme.palette.primary.main}`,
		borderRadius: '50%',
	},
	arrowUp: {
		top: '0',
		left: '50%',
		transform: 'translate(-50%, 0)',
	},
	arrowDown: {
		bottom: '0',
		left: '50%',
		transform: 'translate(-50%, 0)',
	},
	arrowLeft: {
		top: '50%',
		left: '0',
		transform: 'translate(0, -50%)',
	},
	arrowRight: {
		top: '50%',
		right: '0',
		transform: 'translate(0, -50%)',
	},
}));

function SimpleModal(props) {
	const classes = useStyles();

	return (
		<div className={classes.buttonGroup}>
			<ControllButton
				className={classes.arrowUp}
				onClick={() => props.moveHumanPlayer('up')}
				color="primary"
			>
				<ArrowUpwardIcon />
			</ControllButton>
			<ControllButton
				className={classes.arrowDown}
				onClick={() => props.moveHumanPlayer('down')}
				color="primary"
			>
				<ArrowDownwardIcon />
			</ControllButton>
			<ControllButton
				className={classes.arrowLeft}
				onClick={() => props.moveHumanPlayer('left')}
				color="primary"
			>
				<ArrowBackIcon />
			</ControllButton>
			<ControllButton
				className={classes.arrowRight}
				onClick={() => props.moveHumanPlayer('right')}
				color="primary"
			>
				<ArrowForwardIcon />
			</ControllButton>
		</div>
	);
}

export default SimpleModal;
