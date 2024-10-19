import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage/HomePage';
import SignUp from './routes/SignUp/SignUp';
import SignIn from './routes/SignIn/SignIn';
import ForgotPassword from './routes/ForgotPassword/ForgotPassword';
import Voice from './routes/Voice/Voice';
import Upload from './routes/Upload/Upload';

function App() {
	return (
		<Router>
			<div className='App'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/signin' element={<SignIn />} />
					<Route path='/signup' element={<SignUp />} />
					<Route path='/voice' element={<Voice />} />
					<Route path='/upload' element={<Upload />} />
					<Route path='/forgot-password' element={<ForgotPassword />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
