import React, { useEffect, useState } from 'react';
import './Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Determine backend URL based on environment
    const backendUrl =
        process.env.REACT_APP_ENVIRONMENT === 'Prod' && process.env.REACT_APP_BACKEND_URL
            ? process.env.REACT_APP_BACKEND_URL
            : 'http://localhost:8080';

    useEffect(() => {
        const userID = localStorage.getItem('userID');
        if (userID) {
            window.location.href = '/dashboard'; 
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { username, password };

        try {
            const response = await fetch(`${backendUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userID', data.user_id); 
                setSuccess('Login successful! Redirecting...'); 
                setTimeout(() => {
                    window.location.href = '/dashboard'; 
                }, 2000); 
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Login failed. Please try again.'); 
                setSuccess(''); 
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again later.');
            setSuccess(''); 
        }
    };

    const handleRegister = () => {
        window.location.href = '/register'; 
    };

    return (
        <div className="auth-card">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>} {/* Success message display */}
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
                <button type="submit">Login</button>
            </form>
            <button className="register-button" onClick={handleRegister}>Register</button> {/* Register button below login button */}
        </div>
    );
};

export default Login;
