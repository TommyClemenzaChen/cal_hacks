import { useState } from 'react';
import axios from 'axios';
import './Upload.css';

const Upload = () => {
	const [file, setFile] = useState(null);
	const [text, setText] = useState('');
	const [message, setMessage] = useState('');

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
			console.log(JSON.stringify(jsonData));
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
					console.log(JSON.stringify(jsonData));
				} catch (error) {
					setMessage(error.response?.data?.error || 'An error occurred');
				}
			};
			reader.onerror = () => {
				setMessage('Error reading file');
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
				console.log(JSON.stringify(jsonData));
				setMessage(response.data.message);
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
				</div>
			</main>
		</div>
	);
};

export default Upload;
