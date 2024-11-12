import { useState } from 'react';
import { Row, Col, Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; 

const LoginPage = () => {
    return (
        <Container className="login-container">
            <Row className="justify-content-md-center">
                <Col md={6} className="login-form">
                    <h1 className="text-center mb-4">Login</h1>
                    <Form noValidate>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter your email address"
                                name="email"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="doNotLogout">
                            <Form.Check
                                type="checkbox"
                                name="doNotLogout"
                                label="Do not logout"
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-3 mb-3">
                            Login
                        </Button>

                    

                        <div className="text-center mt-4">
                            Don't have an account?
                            <Link to="/register" className="register-link"> Register</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginPage;
