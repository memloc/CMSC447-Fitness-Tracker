import { useState } from 'react';
import { Row, Col, Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import sha256 from 'crypto-js/sha256.js'
import './LoginPage.css'; 

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',  
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5050/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                setError(message || 'Failed to login, please try again');
                setLoading(false);
                return;
            }

			// TODO: Research better approach for this.. collision would not be good
			// Give users a unique id for to use as key for user account data
			const userId = sha256(formData.email).toString()
            const user = { email: formData.email, userId: userId };

            sessionStorage.setItem('user', JSON.stringify(user));
            navigate('/');
        } catch (err) {
            console.error('Login Error:', err);
            setError('Failed to login');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="login-container">
            <Row className="justify-content-md-center">
                <Col md={6} className="login-form">
                    <h1 className="text-center mb-4">Login</h1>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter your email address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-3 mb-3" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : "Login"}
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
