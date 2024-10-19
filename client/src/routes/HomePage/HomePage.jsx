import { useEffect, useState, useRef, onChange } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';
import './HomePage.css';

export default function HomePage() {
	const [user, setUser] = useState(null);
	const [messages, setMessages] = useState([
		{ text: 'Hello, how can I help you today?', isBot: true },
	]);
	const [inputMessage, setInputMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const auth = getAuth();
	const chatboxRef = useRef(null);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user || null);
		});
		return () => unsubscribe();
	}, [auth]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			console.log('Signed out');
		} catch (err) {
			console.log('Error signing out: ', err);
		}
	};
	const handleInputChange = (e) => {
		setInputMessage(e.target.value);
	};

	const handleSendMessage = async () => {
		if (inputMessage.trim() === '') return;

		const newUserMessage = { text: inputMessage, isBot: false };
		setMessages((prevMessages) => [...prevMessages, newUserMessage]);
		setInputMessage(''); // Clear the input after sending
		setIsLoading(true);

		try {
			const res = await axios.post('http://localhost:8000/api/llm/groq', {
				message: inputMessage,
			});

			const botResponse = { text: res.data.response, isBot: true };
			setMessages((prevMessages) => [...prevMessages, botResponse]);
		} catch (err) {
			console.error('Error at query:', err);
			const errorMessage = {
				text: "Sorry, I couldn't process your request.",
				isBot: true,
			};
			setMessages((prevMessages) => [...prevMessages, errorMessage]);
		} finally {
			setIsLoading(false);
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
				<div className='scroll-indicator' onClick={scrollToBottom}>
					<div className='scroll-arrow'></div>
				</div>
			</main>
			<section className='chatbox-section' ref={chatboxRef}>
				<div className='chatbox-container'>
					<div className='chatbox'>
						<div className='chatbox-messages'>
							{messages.map((message, index) => (
								<div
									key={index}
									className={`chatbox-message ${
										message.isBot ? 'bot' : 'user'
									}`}>
									<p className='chatbox-text'>{message.text}</p>
								</div>
							))}
							{isLoading && (
								<div className='chatbox-message bot'>
									<p className='chatbox-text'>Thinking...</p>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>
						<div className='chatbox-input'>
							<input
								type='text'
								className='chatbox-text-input'
								placeholder='Type your message here...'
								value={inputMessage}
								onChange={handleInputChange}
							/>
							<button
								className='chatbox-send-btn'
								onClick={handleSendMessage}
								disabled={isLoading || inputMessage.trim() === ''}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'>
									<line x1='22' y1='2' x2='11' y2='13'></line>
									<polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
