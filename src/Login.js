import React, { useContext, useState } from 'react';
import { AuthContext } from "./AuthProvider";
import { useNavigate } from 'react-router-dom';
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        // TODO: Implement form submission logic (e.g., send data to server)
        const response = await fetch('http://127.0.0.1:5000/users/login', {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        if (response.error) {
            throw new Error('a7a');
        }
        const data = await response.json()
        console.log(data.token)
        login(data.token)
        

        // Clear form
        setFormData({
            email: '',
            password: '',
        });

        setError('');
        navigate('/')
    };

    return (
        <div>
            <h2>Sign in</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
}