import { useContext, useEffect, useState } from "react";
import Owner from "./Owner";
import DropdownButton from "./DropdownButton";
import { AuthContext } from "./AuthProvider";
import './FriendList.css'

export default function FriendList({ option }) {
    const [users, setUsers] = useState(null)
    const { AuthToken } = useContext(AuthContext)



    useEffect(() => {
        const fetchFriends = async () => {
            let response = option === 'friends' ? await fetch('http://127.0.0.1:5000/friends', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${AuthToken}`
                }
            }) :
                await fetch('http://127.0.0.1:5000/friends/received', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${AuthToken}`
                    }
                })
            response = await response.json()
            setUsers(response)
            console.log(response)
        }
        fetchFriends()
    }, [])
    if (!users) {
        console.log(users)
        return null
    }
    return (
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
                <Owner user={theUser} />
                {option === 'friends' && (deleted ? <div>has been removed from your friend list</div> :
                    <DropdownButton setDeleted={setDeleted} settings={'friends'} id={theUser._id} />)}

                {option === 'received' && (
                    theUser.processed === 'accepted' ? <div>has been added to your friends</div>
                        : theUser.processed === 'rejected' ? <div>friend request has been rejected</div> : <div className="friend-buttons">
                            <button className="accept-button" onClick={handleAcceptFriend}>Accept</button>
                            <button className="reject-button" onClick={handleRejectFriend}>Reject</button>
                        </div>
                )}
            </div>
        </div>
    )
}