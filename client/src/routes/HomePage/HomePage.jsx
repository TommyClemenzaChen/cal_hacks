import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';
import './HomePage.css';

export default function HomePage() {
	const [user, setUser] = useState(null);
	const auth = getAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}
		});

		return () => unsubscribe();
	}, [auth]);

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		try {
	// 			const res = await axios.post('http://localhost:8000/api/llm/groq', {
	// 				message: 'Tell me a joke about programming.',
	// 			});

	// 			const data = res.data;

	// 			console.log('Data:', data.response);
	// 		} catch (err) {
	// 			console.error('Error at query:', err);
	// 		}
	// 	};
	// 	fetchData();
	// }, []);

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			console.log('Signed out');
		} catch (err) {
			console.log('Error signing out: ', err);
		}
	};

	return (
		<div className='page-container'>
			<header>
				<nav className='navbar'>
					<ul className='nav-links'>
						<li>
							<a href='/'>Homepage</a>
						</li>
						<li>
							<a href='/voice'>Voice</a>
						</li>
						<li>
							<a href='/upload'>Upload</a>
						</li>
					</ul>
					<div>
						{user ? (
							<button className='sign-out-btn' onClick={handleSignOut}>
								Log out
							</button>
						) : (
							<a href='/signin' className='sign-in-btn'>
								Sign in
							</a>
						)}
					</div>
				</nav>
			</header>
			<main className='hero-section'>
				<div className='hero-content'>
					<h1 className='hero-title'>
						Let go of any worries you have about how you&apos;re feeling. We
						will assess your situation and its severity
					</h1>
				</div>
				<div className='scroll-indicator'>
					<div className='scroll-arrow'></div>
				</div>
			</main>
		</div>
	);
}
