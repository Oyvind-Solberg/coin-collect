import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyAMVJM-WSybI5jnd-2klY0lTNdHqk9s3dI',
	authDomain: 'coin-collect-8215e.firebaseapp.com',
	projectId: 'coin-collect-8215e',
	storageBucket: 'coin-collect-8215e.appspot.com',
	messagingSenderId: '1033441950327',
	appId: '1:1033441950327:web:3c11425f9dbb13ddeea472',
	measurementId: 'G-857N5YE9L5',
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
