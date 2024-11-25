import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import NavbarLogo from './navbar_logo.png';

const Header = () => {
    const [userEmail, setUserEmail] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check sessionStorage for the user's email on component mount
        const user = sessionStorage.getItem('user');
        const { email } = JSON.parse(user) || {};
        if (email) {
            setUserEmail(email);
        }
    }, []);

    const handleLogout = () => {
        // Clear sessionStorage and user state
        sessionStorage.removeItem('user');
        setUserEmail(null);
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar shadow-sm">
            <Container>
                <Navbar.Brand href="/" className="navbar-brand-custom">
                    <img
                        src={NavbarLogo}
                        alt="FitnessTracker Logo"
                        className="navbar-logo me-2"
                    />
                    FitnessTracker
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <LinkContainer to="/calendar">
                            <Nav.Link className="nav-link-custom">Calendar</Nav.Link>
                        </LinkContainer>
                        {userEmail ? (
                            <NavDropdown title={userEmail} id="user-nav-dropdown" className="nav-link-custom">
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <LinkContainer to="/login">
                                <Nav.Link className="nav-link-custom">Login</Nav.Link>
                            </LinkContainer>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;