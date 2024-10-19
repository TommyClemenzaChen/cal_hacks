// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
	apiKey: firebaseApiKey,
	authDomain: 'calhacks-4104c.firebaseapp.com',
	projectId: 'calhacks-4104c',
	storageBucket: 'calhacks-4104c.appspot.com',
	messagingSenderId: '710214945637',
	appId: '1:710214945637:web:0a4337a198defaea536f8c',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
