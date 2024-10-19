import { useState } from 'react';
import { auth, googleProvider } from '../../util/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './SignIn.css';

const SignIn = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleGoogleSignIn = async () => {
		try {
			await signInWithPopup(auth, googleProvider);
			navigate('/');
		} catch (error) {
			console.error('Google Sign-In Error:', error.message);
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate('/');
		} catch (error) {
			console.error('Login Error:', error.message);
		}
	};

	return (
		<div className='signin-container'>
			<div className='signin-card'>
				<h1 className='signin-title'>Log in</h1>
				<p className='signup-text'>
					Don&apos;t have an account?{' '}
					<a href='/signup' className='signup-link'>
						Sign up
					</a>
				</p>

				<button className='google-button' onClick={handleGoogleSignIn}>
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

				<form onSubmit={handleLogin} className='signin-form'>
					<div className='form-group'>
						<label htmlFor='email'>Your email</label>
						<input
							id='email'
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='Enter your email'
							required
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='password'>Your password</label>
						<div className='password-input'>
							<input
								id='password'
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder='Enter your password'
								required
							/>
							<button
								type='button'
								className='password-toggle'
								onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
						<a href='/forgot-password' className='forgot-password'>
							Forgot your password?
						</a>
					</div>

					<button type='submit' className='signin-button'>
						Create an account
					</button>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
