import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import axios from 'axios';
import './Upload.css';

const Upload = () => {
	const [file, setFile] = useState(null);
	const [text, setText] = useState('');
	const [message, setMessage] = useState('');
	const [queryResult, setQueryResult] = useState(''); // New state for query result

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleTextChange = (e) => {
		setText(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const jsonData = {
			text: text,
		};

		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = async () => {
				jsonData.file = reader.result;

				try {
					const response = await axios.post(
						'http://localhost:8000/api/images/upload',
						jsonData,
						{
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);
					setMessage(response.data.message);
					setQueryResult(response.data.query_result); // Set the query result
				} catch (error) {
					setMessage(error.response?.data?.error || 'An error occurred');
				}
			};
		} else {
			// If no file, just send the text
			try {
				const response = await axios.post(
					'http://localhost:8000/api/images/upload',
					jsonData,
					{
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				setMessage(response.data.message);
				setQueryResult(response.data.query_result); // Set the query result
			} catch (error) {
				setMessage(error.response?.data?.error || 'An error occurred');
			}
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
			<main className='upload-section'>
				<div className='upload-container'>
					<h1 className='upload-title'>Upload Image or Text</h1>
					<form onSubmit={handleSubmit} className='upload-form'>
						<div className='upload-item'>
							<label htmlFor='file-upload' className='upload-label'>
								Choose an image:
							</label>
							<input
								type='file'
								id='file-upload'
								onChange={handleFileChange}
								accept='image/*'
								className='file-input'
							/>
						</div>
						<div className='upload-item'>
							<label htmlFor='text-upload' className='upload-label'>
								Enter text:
							</label>
							<textarea
								id='text-upload'
								value={text}
								onChange={handleTextChange}
								className='text-input'
								rows='5'
							/>
						</div>
						<button type='submit' className='upload-button'>
							Upload
						</button>
					</form>
					{message && <p className='upload-message'>{message}</p>}

					{/* New section for displaying the query result */}
					{queryResult && (
						<div className='result-container'>
							<h2 className='result-title'>Advice:</h2>

							<ReactMarkdown className='result-content'>
								{queryResult}
							</ReactMarkdown>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default Upload;
