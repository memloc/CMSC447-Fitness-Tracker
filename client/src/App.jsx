import { Outlet } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'
import LoginPage from './components/LoginPage'
import Calender from './components/Calender'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/Homepage'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/calender" element={<Calender />} />
                <Route path="*" element="404 Page Not Found" />
            </Routes>
        </BrowserRouter>
    )
}
export default App
