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
		<div className='signup-container'>
			<div className='signup-card'>
				<h2 className='signup-title'>Create an account</h2>
				<button className='google-button' onClick={handleGoogleSignUp}>
					<img
						src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4='
						alt='Google logo'
						className='google-icon'
					/>
					Continue with Google
				</button>

				<div className='divider'>
					<span>OR</span>
				</div>

				<form className='signup-form'>
					<div className='form-group'>
						<label>Your email</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className='form-group'>
						<label>Your password</label>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<button
						type='button'
						className='signup-button'
						onClick={handleSignup}>
						Create an account
					</button>
				</form>

				<p className='signin-text'>
					Already have an account?{' '}
					<a href='/signin' className='signin-link'>
						Log in
					</a>
				</p>
			</div>
		</div>
	);
};

export default SignUp;
