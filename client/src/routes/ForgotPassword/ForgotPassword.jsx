import { useState } from 'react';
import { auth } from '../../util/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleResetPassword = async (e) => {
		e.preventDefault();
		if (!email) {
			setMessage('Please enter your email address');
			setIsError(true);
			return;
		}

		setIsLoading(true);
		setMessage('');
		setIsError(false);

		try {
			await sendPasswordResetEmail(auth, email);
			setMessage('Password reset link sent! Check your email inbox.');
			setIsError(false);
			setTimeout(() => {
				navigate('/signin');
			}, 5000);
		} catch (error) {
			setIsError(true);
			switch (error.code) {
				case 'auth/user-not-found':
					setMessage('No account found with this email address.');
					break;
				case 'auth/invalid-email':
					setMessage('Please enter a valid email address.');
					break;
				default:
					setMessage('An error occurred. Please try again later.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='forgot-password-container'>
			<div className='forgot-password-card'>
				<h2 className='forgot-password-title'>Reset Password</h2>
				<p className='forgot-password-description'>
					Enter your email address and we&apos;ll send you a link to reset your
					password.
				</p>

				<form className='forgot-password-form' onSubmit={handleResetPassword}>
					<div className='form-group'>
						<label htmlFor='email'>Email address</label>
						<input
							id='email'
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='Enter your email'
							disabled={isLoading}
						/>
					</div>

					{message && (
						<div className={`message ${isError ? 'error' : 'success'}`}>
							{message}
						</div>
					)}

					<button type='submit' className='reset-button' disabled={isLoading}>
						{isLoading ? 'Sending...' : 'Send Reset Link'}
					</button>

					<div className='back-to-signin'>
						<a href='/signin' className='back-link'>
							← Back to Sign In
						</a>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
