import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './DropdownButton.css'
import { AuthContext } from './AuthProvider';

const DropdownButton = ({ settings, id, setDeleted, handleDelete, setEditable }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { AuthToken, currentUser, setCurrentUser } = useContext(AuthContext)

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleRemoveFriend = () => {
        fetch(`http://127.0.0.1:5000/friends/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${AuthToken}`
            }
        })
        setCurrentUser({ ...currentUser, friends: currentUser.friends - 1 })
        setDeleted(true)
    }



    const dropdownContent = settings === 'user' ? (
        <div className="dropdown-menu">
            <Link to='/profile/edit' className="dropdown-item">edit profile</Link>
            <Link to='/friends' className="dropdown-item">friends</Link>
            <Link to='/friendRequests' className="dropdown-item">received requests</Link>
            <div className="dropdown-item">delete profile</div>
        </div>
    ) : settings === 'post' ? (
        <div className="dropdown-menu">
            <Link to={`/postForm/${id}/edit`} className="dropdown-item">edit post</Link>
            <div onClick={handleDelete} className="dropdown-item">delete post</div>
        </div>
    ) : settings === 'comment' ? (
        <div className="dropdown-menu dropdown-menu-right">
            <div onClick={() => setEditable(true)} className="dropdown-item">edit comment</div>
            <div onClick={handleDelete} className="dropdown-item">delete comment</div>
        </div>
    ) : settings === 'reply' ? (
        <div className="dropdown-menu dropdown-menu-right">
            <div onClick={() => setEditable(true)} className="dropdown-item">edit reply</div>
            <div onClick={handleDelete} className="dropdown-item">delete reply</div>
        </div>
    ) : settings === 'friends' ? (
        <div className="dropdown-menu">
            <button onClick={handleRemoveFriend} className="dropdown-item">remove friend</button>
        </div>
    ) : null;

    return (
        <div className="dropdown-container">
            <button className="dropdown-button" onClick={toggleDropdown}>
                <div className="dots">•••</div>
            </button>
            {showDropdown && dropdownContent}
        </div>
    );
};

export default DropdownButton;
