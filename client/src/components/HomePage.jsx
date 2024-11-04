import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Homepage.css';
import Header from './Header';
import fitnessTrackerImage from './fitness_tracker.png';

const HomePage = () => {
    return (
        <div className="homepage">
            <Header />
            <Container className="homepage-content">
                <Row>
                    <Col md={6} className="text-section">
                        <h1>Welcome to Your Fitness Journey</h1>
                        <p>
                            Embracing a healthy lifestyle starts with making consistent, informed decisions about your fitness journey. Whether you're just beginning or already on your path to peak performance, staying motivated and tracking progress is key. Our website is designed to empower you with comprehensive fitness tracking tools that simplify your routine and keep you inspired.
                        </p>
                        <p>
                            Staying committed to a fitness journey is easier when you have the right support and tools. Our platform is more than just a tracker; it's your virtual fitness partner that celebrates your milestones and helps you set new goals. Take control of your health, celebrate each victory, and stay motivated to achieve your best self with us.
                        </p>
                    </Col>
                    <Col md={6} className="image-section">
                        <img 
                            src={fitnessTrackerImage}
                            alt="Fitness Tracker" 
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default HomePage;