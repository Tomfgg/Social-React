import React, { useState, createContext, useEffect } from 'react';

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
    const [AuthToken, setAuthToken] = useState(localStorage.getItem('AuthToken'))
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        if (!AuthToken) return setCurrentUser(null)
        async function getUser() {
            let response = await fetch('http://127.0.0.1:5000/users', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${AuthToken}`
                }
            })
            response = await response.json()
            setCurrentUser(response)
        }
        getUser()
    }, [AuthToken])

    const login = (token) => {
        setAuthToken(token)
        localStorage.setItem('AuthToken', token)
    }

    const logout = () => {
        setAuthToken(null)
        localStorage.removeItem('AuthToken')
    }

    return (
        <AuthContext.Provider value={{ currentUser, AuthToken, login, logout, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    )
}