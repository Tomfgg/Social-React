import { AuthContext } from "./AuthProvider"
import { useState, useContext } from "react"
import Owner from "./Owner"
import ReactedUsers from "./ReactedUsers"
import LikeButton from "./LikeButton"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
// import './CommentComponent.css';
import DropdownButton from "./DropdownButton"
import { Link } from "react-router-dom"
import CommentFormEdit from "./CommentFormEdit"
// import './SinglePost.css'
import './ReplyComponent.css'

export default function SingleReply({ replySent, setId, setSymbol, setIsReplyFormVisible, setUser, repliesSetter }) {
    // console.log(reply)
    const { AuthToken, currentUser } = useContext(AuthContext)
    const [reply, setReply] = useState(replySent)
    console.log(reply)
    // const { AuthToken } = useContext(AuthContext)
    const [likes, setLikes] = useState(reply.likes)
    const [reacts, setReacts] = useState(null)
    const [isLiked, setIsLiked] = useState(reply.liked)
    const [editable, setEditable] = useState(false)
    // const [replies, setReplies] = useState([])

    const showReacts = async () => {
        let reacts = await fetch(`http://127.0.0.1:5000/users/Comment/${reply._id}`)
        reacts = await reacts.json()
        setReacts(reacts)
    }

    const hideReacts = () => {
        setReacts(null)
    }
    const setData = () => {
        setId(reply._id)
        setSymbol('Reply')
    }
    // const showReplies = async () => {
    //     let newReplies = await fetch(`http://127.0.0.1:5000/comments/${comment._id}?skip=0`, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${AuthToken}`,
    //         },
    //     })
    //     newReplies = await newReplies.json()
    //     console.log([...newReplies])
    //     setReplies([...newReplies])
    //     // setSkip(skip + 3)
    // }
    const handleReplyFormVisibility = () => {
        setIsReplyFormVisible(true)
        setUser({ id: reply.user_id._id, name: reply.user_id.name })
    }

    const handleDeleteReply = () => {
        fetch(`http://127.0.0.1:5000/replies/${reply._id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${AuthToken}`
            }
        })
        repliesSetter(reply)
    }

    if (editable) return (
        <CommentFormEdit setComment={setReply} type={'replies'} comment={reply} setEditable={setEditable} />
    )

    else return (
        <div className="reply-container">
            <div className="reply-header">
                <Owner theUser={reply.user_id} date={reply.createdAt} settings={'reply'} />
                {(currentUser._id === reply.user_id?._id || !reply.user_id) && (
                    <DropdownButton setEditable={setEditable} handleDelete={handleDeleteReply} settings={'reply'} />
                )}
            </div>

            <div className="reply-content">
                {reply.toWhoName && (
                    <Link to={`/user/${reply.toWhoID}`} className="reply-link">
                        {reply.toWhoName}
                    </Link>
                )}
                <p className="reply-description">{reply.describtion}</p>
            </div>

            {reply.file && <img src={reply.file} alt="Reply" className="reply-image" />}

            <div className="reply-actions">
                <LikeButton
                    isLiked={isLiked}
                    setIsLiked={setIsLiked}
                    id={reply._id}
                    setLikes={setLikes}
                    likes={likes}
                    symbol={'Reply'}
                />
                <div onClick={handleReplyFormVisibility} className="reply-button">Reply</div>
            </div>

            <div className="reply-likes-comments">
                {likes > 0 && (
                    <div onClick={setData} className="reply-likes-container">
                        <p className="reply-likes-count">{likes}</p>
                        <FontAwesomeIcon icon={faThumbsUp} className="reply-like-icon" />
                    </div>
                )}
            </div>
        </div>

    );
}