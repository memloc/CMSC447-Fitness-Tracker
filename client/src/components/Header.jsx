import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Header.css';
import NavbarLogo from './navbar_logo.png';

const Header = () => {
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
            <LinkContainer to="/calender">
              <Nav.Link className="nav-link-custom">Calendar</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/login">
              <Nav.Link className="nav-link-custom">Login</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
