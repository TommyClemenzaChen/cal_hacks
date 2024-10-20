import { useState, useRef } from 'react';
import './Voice.css';
import axios from 'axios';

const VoiceTranscriber = () => {
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
				await transcribeAudio(audioBlob);
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
			setTranscribedText(response.data.transcribed_text);
		} catch (err) {
			console.error('Transcription error:', err);
			let errorMessage = 'An error occurred while transcribing the audio';
			if (err.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				errorMessage += `: ${
					err.response.data.error || err.response.statusText
				}`;
			} else if (err.request) {
				// The request was made but no response was received
				errorMessage += ': No response received from server';
			} else {
				// Something happened in setting up the request that triggered an Error
				errorMessage += `: ${err.message}`;
			}
			setError(errorMessage);
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
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default VoiceTranscriber;
