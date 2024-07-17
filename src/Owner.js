import { useContext } from "react"
import { AuthContext } from "./AuthProvider"
import { Link } from "react-router-dom"
import DropdownButton from "./DropdownButton"
import defaultProfileImage from './assets/profile.webp'
import './Owner.css'

export default function Owner({ theUser }) {
    const route = theUser ? `/user/${theUser._id}` : '/profile'
    let user
    const { currentUser } = useContext(AuthContext)
    // console.log(theUser.image)
    if (!theUser) user = currentUser
    else if (theUser.image) user = { ...theUser, image: `http://127.0.0.1:5000/profileImage/${theUser.image}` }
    else user = {...theUser}
    
    return (
        <Link to={`${route}`} className="user-link">
            <img
                src={user.image || defaultProfileImage}
                alt={`${user.name}'s profile`}
                className="profile-image"
            />
            <p className="user-name">{user.name}</p>
        </Link>
    )
}