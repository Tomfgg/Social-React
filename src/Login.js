import React, { useContext, useState } from 'react';
import { AuthContext } from "./AuthProvider";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // if(error) setError('')
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        // TODO: Implement form submission logic (e.g., send data to server)
       try {const response = await fetch('http://127.0.0.1:5000/users/login', {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        if (!response.ok) {
           const error = await response.json()
           throw new Error(error.error || 'Invalid Credentials')
        }
        // if (response.error) {
        //     throw new Error('a7a');
        // }
        const data = await response.json()
        console.log(data.token)
        login(data.token)
        

        // Clear form
        setFormData({
            email: '',
            password: '',
        });

        setError('');
        navigate('/')}
        catch (error) {
            setError(error.message)
        }
    };

    return (
        <div className="outer-container">
            <div className="login-container">
                <h2>Sign in</h2>
                <form onSubmit={handleSubmit}>
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
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Login</button>
                    <div className="signup-link">
                        Don't have an account? <Link to={'/signup'}>Signup</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}