import { useContext, useState } from "react"
import { AuthContext } from "./AuthProvider"
import PostsList from "./PostsList"
import './UserHeader.css';
import DropdownButton from "./DropdownButton";

export default function UserProfile({ id, sentUser }) {
    const { currentUser } = useContext(AuthContext)
    const whosePosts = sentUser ? 'my/get' : `user/${id}`
    if (!currentUser) return null
    console.log(currentUser)
    const header = (sentUser || id === currentUser._id ? <UserHeader sentUser={{...currentUser}} /> : <UserHeader id={id} />)   
    return (
        <>
            {header}
            <PostsList editable={sentUser || id === currentUser._id ? true : false} whosePosts={whosePosts} />
        </>
    )

}

function UserHeader({ id, sentUser }) {
    const { AuthToken, currentUser, setCurrentUser } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    console.log(user)
    if (sentUser) {
        return (
            <div className="user-header">
                <div>{sentUser.name}</div>
                <div>{sentUser.friends} Friends</div>
                <DropdownButton settings={'user'} />
            </div>
        );
    }

    else {
        const handleAddFriend = () => {
             fetch(`http://127.0.0.1:5000/friends/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${AuthToken}`
                }
            })
            setUser({ ...user, relation: 'isent' })
        }

        const handleAcceptFriend = () => {
            fetch(`http://127.0.0.1:5000/friends/accept/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${AuthToken}`
                }
            })
            setUser({...user,relation:'friend'})
            setCurrentUser({ ...currentUser, friends: currentUser.friends+1})
        }

        const handleRejectFriend = () => {
            fetch(`http://127.0.0.1:5000/friends/reject/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${AuthToken}`
                }
            })
            setUser({...user,relation:'none'})
        }

        const fetchUser = async () => {
            let response = await fetch(`http://127.0.0.1:5000/users/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${AuthToken}`
                }
            })
            response = await response.json()
            console.log(response)
            setUser(response)
        }
        if (!user) { fetchUser() }
        console.log(user)
        return (
            <div className="user-header">
                <div>{user ? user.name : 'Loading...'}</div>
                {user && user.relation === 'friend' && <button className="friend">Friend</button>}
                {user && user.relation === 'isent' && <button className="cancel-request">Cancel Request</button>}
                {user && user.relation === 'ireceived' && (
                    <div>
                        <button onClick={handleAcceptFriend} className="accept">Accept friend request</button>
                        <button onClick={handleRejectFriend} className="reject">Reject friend request</button>
                    </div>
                )}
                {user && user.relation === 'none' && <button onClick={handleAddFriend} className="add-friend">Add Friend</button>}
            </div>
        );
    }
}

