import React, { useState } from 'react';
import './Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Determine backend URL based on environment
    const backendUrl =
        process.env.REACT_APP_ENVIRONMENT === 'Prod' && process.env.REACT_APP_BACKEND_URL
            ? process.env.REACT_APP_BACKEND_URL
            : 'http://localhost:8080';

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { username, password };

        try {
            const response = await fetch(`${backendUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Registration failed. Please try again.'); 
                setSuccess(''); 
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again later.');
            setSuccess(''); 
        }
    };

    const handleGoBack = () => {
        window.location.href = '/';
    };

    return (
        <div className="auth-card">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>} {/* Display error message */}
            {success && <p className="success">{success}</p>} {/* Display success message */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            <button onClick={handleGoBack} className="back-button">
                Back to Login
            </button>
        </div>
    );
};

export default Register;
