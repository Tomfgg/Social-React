import { useContext, useEffect, useState } from "react";
import Owner from "./Owner";
import DropdownButton from "./DropdownButton";
import { AuthContext } from "./AuthProvider";
import './FriendList.css'
import { useLocation } from 'react-router-dom';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export default function FriendList({ option }) {
    const [users, setUsers] = useState(null)
    const { AuthToken } = useContext(AuthContext)
    const [loading, setLoading] = useState(false); // Loading state

    const query = useQuery();
    const searchQuery = query.get('q');


    useEffect(() => {
        setLoading(true);
        const fetchFriends = async () => {
            let response
            if (option === 'friends') {
               response = await fetch('http://127.0.0.1:5000/friends', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${AuthToken}`
                    }
                })
            }
            else if (option === 'users') {
                console.log('a7a')
                response = await fetch(`http://127.0.0.1:5000/users/search/?q=${searchQuery}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${AuthToken}`
                    }
                })
            }

            else {
               response = await fetch('http://127.0.0.1:5000/friends/received', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${AuthToken}`
                    }
                })
            }
            
            response = await response.json()
            console.log(response)
            setUsers(response)
            setLoading(false)
        }
        fetchFriends()
    }, [option, searchQuery])

    // if (!users) {
    //     console.log(users)
    //     return null
    // }
    if (loading) return <div className="spinner">Loading...</div> // Show loading spinner

    else if (!users || users.length === 0) return <div class="centered-container">
        <div class="centered-message">
            No {option === 'friends' ? 'friends' :
                option === 'users' ? 'search results' : 'received requests'} Found
        </div>
    </div>

    else return (
        <>
            {
                users.map(user => (
                    <SingleUserRecord key={user._id} user={user} option={option} />
                ))
            }
        </>
    )
}

function SingleUserRecord({ user, option }) {
    console.log(user)
    const [theUser, setTheUser] = useState(user)
    const { AuthToken, currentUser, setCurrentUser } = useContext(AuthContext)
    const [deleted, setDeleted] = useState(false)

    const handleAcceptFriend = () => {
        fetch(`http://127.0.0.1:5000/friends/accept/${theUser._id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${AuthToken}`
            }
        })
        setTheUser({ ...theUser, processed: 'accepted' })
        setCurrentUser({ ...currentUser, friends: currentUser.friends + 1 })
    }

    const handleRejectFriend = () => {
        fetch(`http://127.0.0.1:5000/friends/reject/${theUser._id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${AuthToken}`
            }
        })
        setTheUser({ ...theUser, processed: 'rejected' })
    }

    if (!theUser) return null
    return (
        <div>
            <div className="friends-header">
                <Owner theUser={theUser} />
                {option === 'friends' && (deleted ? <div>has been removed from your friend list</div> :
                    <DropdownButton setDeleted={setDeleted} settings={'friends'} id={theUser._id} />)}

                {option === 'received' && (
                    theUser.processed === 'accepted' ? <div>has been added to your friends</div>
                        : theUser.processed === 'rejected' ? <div>friend request has been rejected</div> : <div className="friend-buttons">
                            <button className="accept-button" onClick={handleAcceptFriend}>Accept</button>
                            <button className="reject-button" onClick={handleRejectFriend}>Reject</button>
                        </div>
                )}

                {/* {option === 'users' && (
                    theUser.friend ? <button>Friend</button>
                        : <button>Add Friend</button>
                )} */}

            </div>
        </div>
    )
}