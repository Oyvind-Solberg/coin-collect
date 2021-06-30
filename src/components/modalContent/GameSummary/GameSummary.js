import Typography from '@material-ui/core/Typography';

function GameSummary(props) {
	if (props.victory) {
		return (
			<>
				<Typography align="center" gutterBottom variant="h2">
					Congratulation! You won the game!
				</Typography>
				<Typography align="center" paragraph>
					{props.user.name} got {props.user.score} points!
				</Typography>
			</>
		);
	} else {
		return (
			<>
				<Typography align="center" gutterBottom variant="h2">
					I'm sorry! You lost the game!
				</Typography>
				<Typography align="center" paragraph>
					{props.user.name} got {props.user.score} points!
				</Typography>
			</>
		);
	}
}

export default GameSummary;
