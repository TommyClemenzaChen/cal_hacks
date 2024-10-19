// SignUp.jsx
import { useState } from 'react';
import { auth, googleProvider } from '../../util/firebase';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleGoogleSignUp = async () => {
		try {
			await signInWithPopup(auth, googleProvider);
			console.log('Signed Up with google');
			navigate('/');
		} catch (error) {
			console.error('Google Sign-In Error:', error.message);
		}
	};

	const handleSignup = async () => {
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			console.log('Signed Up with user and pass');
			navigate('/');
		} catch (error) {
			console.error('Signup Error:', error.message);
		}
	};

	return (
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			<h2>Sign Up</h2>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button onClick={handleSignup}>Sign Up</button>
			<button onClick={handleGoogleSignUp}>Sign Up with Google</button>
			<p>
				Already have an account? <a href='/signin'>Sign In</a>
			</p>
		</div>
	);
};

export default SignUp;
