import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css'

export default function Signup() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')

        // Basic validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords did not match');
            return;
        }
        if (formData.password.length < 5) {
            setError('Password should have at least 5 characters');
            return;
        }
        if (formData.name.length < 3 || formData.name.length > 15) {
            setError('Username should have be between 3 and 15 characters');
            return;
        }
        const nameRegex = /^(?! )[A-Za-z]+(?: [A-Za-z]+)*(?<! )$/;
        if (!nameRegex.test(formData.name)) {
            setError('Invalid name');
            return;
        }

        // TODO: Implement form submission logic (e.g., send data to server)
        try {
            const response = await fetch('http://127.0.0.1:5000/users', {
                method: 'POST', // HTTP method
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error);
            }
            // if (response.error) {
            //     throw new Error('a7a'); 
            // }

            // Clear form
            setFormData({
                name: '',
                email: '',
                password: '',
            });

            setError('');
            navigate('/Login')
        }
        catch (error) {
            setError(error.message)
        }
    };

    return (
        <div className="outer-container">
            <div className="signup-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Sign Up</button>
                    <div className="login-link">
                        Already have an account? <Link to={'/Login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}