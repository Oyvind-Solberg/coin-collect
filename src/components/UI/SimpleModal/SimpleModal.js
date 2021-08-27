import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '50%',
		backgroundColor: theme.palette.background.paper,
		// border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		[theme.breakpoints.down('sm')]: {
			width: '90%',
			padding: '1rem',
		},
	},
	button: {
		position: 'absolute',
		top: '0.2rem',
		right: '0.2rem',
		// transform: 'translate(-50%, -50%)',
	},
}));

function SimpleModal(props) {
	const classes = useStyles();
	const body = (
		<div className={classes.paper}>
			<IconButton
				className={classes.button}
				onClick={props.closeModal}
				aria-label="close"
				color="primary"
			>
				<CloseIcon />
			</IconButton>
			{props.children}
		</div>
	);

	return (
		<Modal open={props.modal.isOpen} onClose={props.closeModal}>
			{body}
		</Modal>
	);
}

export default SimpleModal;
