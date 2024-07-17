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



    const dropdownContent = settings === 'user' ? <div className="dropdown-menu">
        <Link to='/profile/edit' className="dropdown-item">edit profile</Link>
        <Link to='/friends' className="dropdown-item">friends</Link>
        <Link to='/friendRequests' className="dropdown-item">received requests</Link>
        <Link className="dropdown-item">delete profile</Link>
    </div> : settings === 'post' ? <div className="dropdown-menu">
        <Link to={`/postForm/${id}/edit`} className="dropdown-item">edit post</Link>
        <Link onClick={handleDelete} className="dropdown-item">delete post</Link>
    </div> : settings === 'comment' ? <div className="dropdown-menu">
        <div onClick={() => setEditable(true)} className="dropdown-item">edit comment</div>
        <Link onClick={handleDelete} className="dropdown-item">delete comment</Link>
    </div> : settings === 'reply' ? <div className="dropdown-menu">
        <Link onClick={() => setEditable(true)} className="dropdown-item">edit reply</Link>
        <Link onClick={handleDelete} className="dropdown-item">delete reply</Link>
    </div> : settings === 'friends' ? <div className="dropdown-menu">
        <button onClick={handleRemoveFriend} className="dropdown-item">remove friend</button>
    </div> : null

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
