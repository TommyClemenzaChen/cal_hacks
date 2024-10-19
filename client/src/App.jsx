import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage/HomePage';
import SignUp from './routes/SignUp/SignUp';
import SignIn from './routes/SignIn/SignIn';

function App() {
	return (
		<Router>
			<div className='App'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/signin' element={<SignIn />} />
					<Route path='/signup' element={<SignUp />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
