import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function Instructions(props) {
	return (
		<>
			<Typography align="center" variant="h2" gutterBottom>
				Instructions
			</Typography>
			<Typography paragraph>
				Coin Collect is a game where the goal is to collect as many coins as you
				can without getting caught by the enemy player.
			</Typography>
			<Typography paragraph>
				You can move your player with the arrow keys.
			</Typography>
		</>
	);
}

export default Instructions;
