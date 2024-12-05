import { useState } from 'react';
import { Row, Col, Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import sha256 from 'crypto-js/sha256.js'
import './SignUpPage.css'; 

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5050/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (response.ok) {
                setSuccess("Account Created Successfully");

				// TODO: Research better approach for this.. 
				const userId = sha256(formData.email).toString()
                const user = { email: formData.email, userId: userId };

                sessionStorage.setItem('user', JSON.stringify(user));
                setTimeout(() => navigate('/'), 1000);
            }

            else {
                const errorDate = await response.json();
                setError(errorDate.message || 'Failed to register');
            }
        } catch (err) {
            console.error('Registration Error:', err);
            setError('Failed to register');
        } finally {
            setLoading(false);
        }   
    }

    return (
        <Container className="login-container">
            <Row className="justify-content-md-center">
                <Col md={6} className="login-form">
                    <h1 className="text-center mb-4">Register</h1>
                    <Form noValidate onSubmit={handleSubmit}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

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

                        <Form.Group className="mb-3" controlId="confirm-password">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Confirm your password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-3 mb-3" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
                        </Button>

                        <div className="text-center mt-4">
                            Already have an account?
                            <Link to="/login" className="register-link"> Sign In</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default SignUpPage;
