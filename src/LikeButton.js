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
        fetch(`http://127.0.0.1:5000/likes/${symbol}/${id}`, {
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
                style={{ color: isLiked ? 'blue' : 'gray', cursor: 'pointer' }}
            /> : <div style={{ color: isLiked ? 'blue' : 'black', cursor: 'pointer' }} onClick={toggleLike}>Like</div>}
        </div>
    )
}