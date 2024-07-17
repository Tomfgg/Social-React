import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import './Navbar.css';
import defaultProfileImage from './assets/profile.webp'

export default function Navbar() {
    const { AuthToken, logout,currentUser } = useContext(AuthContext)
    const [user,setUser] = useState(null)
    // let user
    // if (AuthToken) {
    //     user =  getUserName(AuthToken)
    //     console.log(user.name)
    // }
    //      user = await fetch('http://127.0.0.1:5000/users', {
    //         method: 'GET', // HTTP method
    //         headers: {
    //             'Authorization': `Bearer ${AuthToken}`,
    //         },
    //     })
    // }

    
    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (AuthToken) {
    //             try {
    //                 let response = await fetch('http://127.0.0.1:5000/users', {
    //                     method: 'GET',
    //                     headers: {
    //                         'Authorization': `Bearer ${AuthToken}`,
    //                     },
    //                 });
    //                 let user = await response.json();
    //                 console.log(user.name);
    //                 setUser(user);
    //             } catch (error) {
    //                 console.error('Error fetching user data:', error);
    //             }
    //         }
    //     };

    //     fetchData();
    // }, [AuthToken]);

    
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/about" className="nav-link">About</Link>
                </li>
                <li className="nav-item">
                    <Link to="/contact" className="nav-link">Contact</Link>
                </li>
                {AuthToken && (
                    <li className="nav-item">
                        <button onClick={logout} className="nav-button">Logout</button>
                    </li>
                )}
                {currentUser && (
                    <li className="nav-item">
                        <img
                            src={currentUser.image || defaultProfileImage}
                            alt={`${currentUser.name}'s profile`}
                            className="profile-image"
                        />
                        <Link to="/profile" className="nav-user">{currentUser.name}</Link>
                    </li>
                )}
                <li className="nav-item">
                    <Link to="/postForm" className="nav-link">Add Post</Link>
                </li>
            </ul>
        </nav>
    );
}

// async function getUserName(token) {
//     let user =  await fetch('http://127.0.0.1:5000/users', {
//         method: 'GET', // HTTP method
//         headers: {
//             'Authorization': `Bearer ${token}`,
//         },
//     })
//      let user2 = await user.json()
//     return user2
// }
