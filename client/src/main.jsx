import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Workout from './components/Workout'
import Calendar from './components/Calendar'
import LoginPage from './components/LoginPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
		<App />
    </React.StrictMode>
)
