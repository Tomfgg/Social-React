import { useContext, useState } from "react"
import { AuthContext } from "./AuthProvider"
import PostsList from "./PostsList"
import './UserHeader.css';
import DropdownButton from "./DropdownButton";
import defaultProfileImage from './assets/profile.webp' 

export default function UserProfile({ id, sentUser }) {
    console.log(id)
    console.log(sentUser)
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
    console.log(sentUser)
    if (sentUser) {
        return (
            <div className="user-header">
                <img src={sentUser.image ? sentUser.image : defaultProfileImage} alt="Profile" />
                <div className="user-info">
                    <div className="user-name">{sentUser.name}</div>
                    <div className="user-friends">{sentUser.friends} Friends</div>
                </div>
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

       const handleCancelRequest = ()=>{
           fetch(`http://127.0.0.1:5000/friends/withdraw/${id}`, {
               method: 'POST',
               headers: {
                   Authorization: `Bearer ${AuthToken}`
               }
           })
           setUser({ ...user, relation: 'none' })
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

        if (!user) { 
            fetchUser() 
            return null
        }

        console.log(user)
        return (
        <div className="user-header">
                <img src={user && user.image ? `http://127.0.0.1:5000/profileImage/${user.image}` : defaultProfileImage} alt="Profile" />
            <div className="user-info">
                <div className="user-name">{user ? user.name : 'Loading...'}</div>
                    {user && user.relation === 'friend' && <button className="friend">Friend</button>}
                    {user && user.relation === 'isent' && <button onClick={handleCancelRequest} className="cancel-request">Cancel Request</button>}
                    {user && user.relation === 'ireceived' && (
                        <div>
                            <button onClick={handleAcceptFriend} className="accept">Accept friend request</button>
                            <button onClick={handleRejectFriend} className="reject">Reject friend request</button>
                        </div>
                    )}
                    {user && user.relation === 'none' && <button onClick={handleAddFriend} className="add-friend">Add Friend</button>}
            </div>
            
        </div>
    );
    }
}

