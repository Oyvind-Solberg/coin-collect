import BackgroundImage from '../BackgroundImage/BackgroundImage';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	container: {
		height: '150px',
		width: '100%',
		margin: 'auto',
	},
}));

function SimpleModal(props) {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<BackgroundImage width="100%" height="100%" image={props.image} />
		</div>
	);
}

export default SimpleModal;
