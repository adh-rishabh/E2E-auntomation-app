import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Studio } from './pages/Studio'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Studio />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
