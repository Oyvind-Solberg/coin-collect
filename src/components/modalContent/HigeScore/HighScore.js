import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	// root: {
	// 	'&:nth-of-type(odd)': {
	// 		backgroundColor: theme.palette.action.hover,
	// 	},
	// },
}))(TableRow);

const useStyles = makeStyles({
	table: {
		// minWidth: 700,
	},
});

function HighScore(props) {
	const classes = useStyles();

	return (
		<>
			<Typography align="center" variant="h2" gutterBottom>
				High Score
			</Typography>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell>User</StyledTableCell>
							<StyledTableCell align="right">Score</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{props.highScore.map((row) => (
							<StyledTableRow key={row.user}>
								<StyledTableCell component="th" scope="row">
									{row.user}
								</StyledTableCell>
								<StyledTableCell align="right">{row.score}</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

export default HighScore;
