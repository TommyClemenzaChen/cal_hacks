import { useState, useRef } from 'react';
import './Voice.css';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const VoiceTranscriber = () => {
	const [agentResponse, setAgentResponse] = useState('');
	const [transcribedText, setTranscribedText] = useState('');
	const [isRecording, setIsRecording] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const mediaRecorder = useRef(null);
	const audioChunks = useRef([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder.current = new MediaRecorder(stream);
			mediaRecorder.current.ondataavailable = (event) => {
				audioChunks.current.push(event.data);
			};
			mediaRecorder.current.start();
			setIsRecording(true);
		} catch (err) {
			setError('Error accessing microphone');
			console.error(err);
		}
	};

	const stopRecording = () => {
		if (mediaRecorder.current) {
			mediaRecorder.current.stop();
			mediaRecorder.current.onstop = async () => {
				const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
				audioChunks.current = [];
				await handleTranscription(audioBlob);
			};
			setIsRecording(false);
		}
	};

	const transcribeAudio = async (audioBlob) => {
		setIsLoading(true);
		setError('');

		const formData = new FormData();
		formData.append('audio', audioBlob);

		try {
			const response = await axios.post(
				'http://localhost:8000/api/voices/transcribe',
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
					withCredentials: true,
				}
			);
			const transcribedText = response.data.transcribed_text;
			setTranscribedText(transcribedText);
			return transcribedText; // Return the transcribed text
		} catch (err) {
			console.error('Transcription error:', err);
			let errorMessage = 'An error occurred while transcribing the audio';
			if (err.response) {
				errorMessage += `: ${
					err.response.data.error || err.response.statusText
				}`;
			} else if (err.request) {
				errorMessage += ': No response received from server';
			} else {
				errorMessage += `: ${err.message}`;
			}
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const getAgentResponse = async (text) => {
		console.log('Sending to agent:', text); // Debugging log
		try {
			const response = await axios.post(
				'http://localhost:8000/api/voices/respond',
				{ text }
			);
			// Use displayTextSlowly to show the response gradually
			displayTextSlowly(response.data.response_text, 25);
		} catch (err) {
			console.error('Response error:', err);
			setError('Error getting response from agent');
		}
	};

	const handleTranscription = async (audioBlob) => {
		const transcription = await transcribeAudio(audioBlob);
		await getAgentResponse(transcription);
	};

	const displayTextSlowly = (text, interval) => {
		let index = 0;

		const intervalId = setInterval(() => {
			if (index < text.length) {
				setAgentResponse((prev) => prev + text[index]);
				index++;
			} else {
				clearInterval(intervalId);
			}
		}, interval);
	};

	return (
		<div className='page-container'>
			<header>
				<nav className='navbar'>
					<ul className='nav-links'>
						<li>
							<a href='/'>Home</a>
						</li>
						<li>
							<a href='/voice'>Voice</a>
						</li>
						<li>
							<a href='/upload'>Upload</a>
						</li>
					</ul>
				</nav>
			</header>
			<main className='voice-section'>
				<div className='voice-container'>
					<h1 className='voice-title'>Voice Transcriber</h1>
					<div className='voice-controls'>
						<button
							onClick={isRecording ? stopRecording : startRecording}
							className={`voice-button ${isRecording ? 'recording' : ''}`}>
							{isRecording ? 'Stop Recording' : 'Start Recording'}
						</button>
					</div>

					{isLoading && <p className='voice-status'>Transcribing...</p>}
					{error && <p className='voice-error'>{error}</p>}

					{transcribedText && (
						<div className='transcription-result'>
							<h2 className='transcription-title'>Transcribed Text:</h2>
							<p className='transcription-text'>{transcribedText}</p>
							<h2 className='transcription-title'>Agent Response:</h2>
							<ReactMarkdown className='transcription-text'>
								{agentResponse}
							</ReactMarkdown>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default VoiceTranscriber;
