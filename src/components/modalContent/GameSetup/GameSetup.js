import { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	input: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '100%',
		},
	},
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	actionsContainer: {
		marginBottom: theme.spacing(2),
	},
	startGameContainer: {
		padding: theme.spacing(3),
	},
}));

function GameSetup(props) {
	const [userName, setUserName] = useState('');
	const [worldSize, setWorldSize] = useState(9);
	const [difficultyLevel, setDifficultyLevel] = useState('normal');
	const [activeStep, setActiveStep] = useState(0);

	const handleStarteNewGame = () => {
		props.startNewGame(userName, worldSize, difficultyLevel);
		props.closeModal();
	};

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	function getSteps() {
		return ['Enter username', 'Set game world size', 'Set game difficulty'];
	}

	const classes = useStyles();

	const steps = getSteps();

	function getStepContent(step) {
		switch (step) {
			case 0:
				return (
					<>
						<form className={classes.input} noValidate autoComplete="off">
							<TextField
								id="userName"
								label="Username"
								value={userName}
								onChange={(event) => setUserName(event.target.value)}
								variant="outlined"
							/>
						</form>
					</>
				);
			case 1:
				return (
					<>
						<Typography gutterBottom>World size</Typography>
						<Slider
							defaultValue={worldSize}
							value={worldSize}
							valueLabelDisplay="on"
							step={2}
							marks
							min={5}
							max={13}
							onChange={(event, value) => setWorldSize(value)}
						/>
					</>
				);
			case 2:
				return (
					<FormControl component="fieldset">
						<FormLabel component="legend">Difficulty level</FormLabel>
						<RadioGroup
							aria-label="Difficulty level"
							name="difficultLevel"
							value={difficultyLevel}
							onChange={(event, value) => setDifficultyLevel(value)}
						>
							<FormControlLabel value="easy" control={<Radio />} label="Easy" />
							<FormControlLabel
								value="normal"
								control={<Radio />}
								label="Normal"
							/>
							<FormControlLabel value="hard" control={<Radio />} label="Hard" />
						</RadioGroup>
					</FormControl>
				);
			default:
				return 'Unknown step';
		}
	}

	return (
		<>
			<Typography align="center" variant="h2">
				Game Setup
			</Typography>
			<div className={classes.root}>
				<Stepper activeStep={activeStep} orientation="vertical">
					{steps.map((label, index) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
							<StepContent>
								{getStepContent(index)}
								<div className={classes.actionsContainer}>
									<div>
										<Button
											disabled={activeStep === 0}
											onClick={handleBack}
											className={classes.button}
										>
											Back
										</Button>
										<Button
											variant="contained"
											color="primary"
											onClick={handleNext}
											className={classes.button}
										>
											{activeStep === steps.length - 1 ? 'Finish' : 'Next'}
										</Button>
									</div>
								</div>
							</StepContent>
						</Step>
					))}
				</Stepper>
				{activeStep === steps.length && (
					<Paper square elevation={0} className={classes.startGameContainer}>
						<Typography>
							All steps completed - you&apos;re ready to start the game!
						</Typography>
						<Button
							variant="contained"
							color="primary"
							onClick={handleStarteNewGame}
							className={classes.button}
						>
							Start new game
						</Button>
					</Paper>
				)}
			</div>
		</>
	);
}

export default GameSetup;
