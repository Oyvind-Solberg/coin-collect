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
	container: {
		display: 'flex',
		margin: 'auto',
	},
	buttonGroup: {
		position: 'relative',
		bottom: '0',
		right: '0',
		width: '120px',
		height: '120px',
		// border: `1px solid ${theme.palette.primary.main}`,
		borderRadius: '50%',
		margin: '1rem',
	},
	button: {
		backgroundColor: theme.palette.primary.light,
		color: 'black',
		'&:focus': {
			backgroundColor: theme.palette.primary.light,
		},
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
		<div className={classes.container}>
			<div className={classes.buttonGroup}>
				<ControllButton
					className={`${classes.arrowUp} ${classes.button}`}
					onClick={() => props.moveHumanPlayer('up')}
					color="primary"
				>
					<ArrowUpwardIcon />
				</ControllButton>
				<ControllButton
					className={`${classes.arrowDown} ${classes.button}`}
					onClick={() => props.moveHumanPlayer('down')}
					color="primary"
				>
					<ArrowDownwardIcon />
				</ControllButton>
				<ControllButton
					className={`${classes.arrowLeft} ${classes.button}`}
					onClick={() => props.moveHumanPlayer('left')}
					color="primary"
				>
					<ArrowBackIcon />
				</ControllButton>
				<ControllButton
					className={`${classes.arrowRight} ${classes.button}`}
					onClick={() => props.moveHumanPlayer('right')}
					color="primary"
				>
					<ArrowForwardIcon />
				</ControllButton>
			</div>
		</div>
	);
}

export default SimpleModal;
