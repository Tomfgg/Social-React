import { useContext, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "./AuthProvider";

export default function LikeButton({ isLiked, setIsLiked, id, setLikes, likes, symbol }) {
    // const [isLiked, setIsLiked] = useState(liked)
    const { AuthToken } = useContext(AuthContext)

    const toggleLike = () => {
        const newLikesCount = isLiked ? likes - 1 : likes + 1;
        setLikes(newLikesCount);
        setIsLiked(!isLiked);
        fetch(`https://social-app-f6f0.onrender.com/likes/${symbol}/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AuthToken}`,
            },
        })
    };

    return (
        <div>
            {symbol === 'Post' ? <FontAwesomeIcon 
                icon={faThumbsUp}
                onClick={toggleLike}
                style={{ color: isLiked ? '#1877f2': 'gray', cursor: 'pointer' }}
            /> : <div style={{ color: isLiked ? '#1877f2' : 'black', cursor: 'pointer' }} onClick={toggleLike}>Like</div>}
        </div>
    )
}