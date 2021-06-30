import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	image: {
		backgroundImage: (props) => `url(${props.image})`,
		backgroundColor: 'rgba(255,255,255,0)',
		backgroundPosition: 'center',
		backgroundSize: 'contain',
		backgroundRepeat: 'no-repeat',
		width: (props) => props.width,
		height: (props) => props.height,
		// position: 'absolute',
		// top: '50%',
		// left: '50%',
		// transform: 'translate(-50%, -50%)',
		// zIndex: (props) => `${props.zIndex}`,
	},
}));

function BackgroundImage(props) {
	const classes = useStyles(props);

	return <div className={classes.image}></div>;
}

export default BackgroundImage;
