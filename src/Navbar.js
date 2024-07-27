import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import './Navbar.css';
import defaultProfileImage from './assets/profile.webp'
import { FaSearch } from 'react-icons/fa';
import logo from './assets/Connectify.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
    const { AuthToken, logout,currentUser } = useContext(AuthContext)
    const [user,setUser] = useState(null)

    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        
        // Handle the search logic here
        if (!searchQuery) return
        navigate(`/search?q=${searchQuery}`)
        console.log('Search query:', searchQuery);  
    };

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
    useEffect(() => {
        if (location.pathname !== '/search') {
            setSearchQuery('');
        }
    }, [location]);
    
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
        <nav className="n-navbar">
            <ul className="n-nav-list">
                <li className="n-nav-item">
                    <div className="n-navbar-brand">
                        <Link to="/">
                            <img src={logo} alt="SocialApp Logo" className="n-navbar-logo" />
                        </Link>
                    </div>
                    <form className="n-navbar-search" onSubmit={handleSearchSubmit}>
                        <FaSearch className="n-search-icon" />
                        <input
                            type="text"
                            placeholder="Search for users"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </form>
                </li>
                <li className="n-nav-item">
                    <Link to="/" className="n-nav-link">
                        <FontAwesomeIcon icon={faHome} className="n-navbar-icon" />
                    </Link>
                </li>
                {AuthToken && (
                    <li className="n-nav-item">
                        <div onClick={logout} className="n-nav-link">
                            <FontAwesomeIcon icon={faSignOutAlt} className="n-navbar-icon" />
                        </div>
                    </li>
                )}
                <li className="n-nav-item">
                    <Link to="/postForm" className="n-nav-link">
                        <FontAwesomeIcon icon={faPlus} className="n-navbar-icon" />
                    </Link>
                </li>
                {currentUser && (
                    <li className="n-nav-item">
                        <img
                            src={currentUser.image || defaultProfileImage}
                            alt={`${currentUser.name}'s profile`}
                            className="n-profile-image"
                        />
                        <Link to="/profile" className="n-nav-user">{currentUser.name}</Link>
                    </li>
                )}
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
