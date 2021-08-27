import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			light: '#76a04a',
			main: '#4e7029',
			dark: '#263b10',
		},
		secondary: {
			light: '#ffff81',
			main: '#ffd54f',
			dark: '#c8a415',
		},
		tertiary: {
			light: '#ebdac2',
			main: '#ceb48d',
			dark: '#a18965',
		},
	},
	overrides: {
		MuiTypography: {
			h1: {
				fontSize: [34, '!important'],
			},
			h2: {
				fontSize: [26, '!important'],
			},
		},
	},
});

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
