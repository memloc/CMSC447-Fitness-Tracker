import React from 'react'
import { Outlet } from 'react-router-dom'
import Calendar from './components/Calendar'
import './App.css'

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Fitness Tracker</h1>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default App
