import './App.css'
import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Calendar from './components/Calendar'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'


function App() {
    return (
		<BrowserRouter>
            <Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/calendar" element={<Calendar />} />
				<Route path="*" element="404 Page Not Found" />
            </Routes>
        </BrowserRouter>
    )
}

export default App
