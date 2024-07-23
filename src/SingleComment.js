import { AuthContext } from "./AuthProvider"
import { useState, useContext } from "react"
import Owner from "./Owner"
import ReactedUsers from "./ReactedUsers"
import LikeButton from "./LikeButton"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import RepliesList from "./RepliesList"
import './CommentComponent.css';
import DropdownButton from "./DropdownButton"
import CommentForm from "./CommentForm"
import ReplyForm from "./ReplyForm"
import CommentFormEdit from "./CommentFormEdit"
import { CommentsCountContext } from './SinglePost'
// import './SinglePost.css'

export default function SingleComment({ commentSent, setId, setSymbol, commentsSetter }) {
    const {decrementComments} = useContext(CommentsCountContext)
    const { AuthToken, currentUser } = useContext(AuthContext)
    const [comment, setComment] = useState(commentSent)
    console.log(comment)
    const [likes, setLikes] = useState(comment.likes)
    const [reacts, setReacts] = useState(null)
    const [replies, setReplies] = useState([])
    const [isLiked, setIsLiked] = useState(comment.liked)
    const [isReplyFormVisible, setIsReplyFormVisible] = useState(false)
    const [user, setUser] = useState(null)
    const [editable, setEditable] = useState(false)


    console.log(comment.user_id.image)
    console.log(isLiked)
    const showReacts = async () => {
        let reacts = await fetch(`http://127.0.0.1:5000/users/Comment/${comment._id}`)
        reacts = await reacts.json()
        setReacts(reacts)
    }

    const handleAddedReply = (addedReply) => {
        setReplies([...replies, addedReply])
    }

    const hideReacts = () => {
        setReacts(null)
    }

    const setData = () => {
        setId(comment._id)
        setSymbol('Comment')
    }

    const showReplies = async () => {
        let newReplies = await fetch(`http://127.0.0.1:5000/replies/${comment._id}?skip=0`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AuthToken}`,
            },
        })
        newReplies = await newReplies.json()
        console.log([...newReplies])
        setReplies([...newReplies])
        // setSkip(skip + 3)
    }

    const handleVisible = () => {
        setIsReplyFormVisible(true)
        setUser({ id: comment.user_id._id, name: comment.user_id.name })
    }

    const handleDeleteComment = async() => {
        let response = await fetch(`http://127.0.0.1:5000/comments/${comment._id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${AuthToken}`
            }
        })
        response = await response.json()
        commentsSetter(comment)
        decrementComments(response.count)
    }

    if (editable) return (
        <CommentFormEdit setComment={setComment} type={'comments'} comment={comment} setEditable={setEditable} />
    )

    else return (
        <div className="comment-container">
            <div className="comment-header">
                <Owner theUser={comment.user_id} date={comment.createdAt} settings={'comment'} />
                {(currentUser._id === comment.user_id?._id || !comment.user_id) && (
                    <DropdownButton setEditable={setEditable} handleDelete={handleDeleteComment} settings={'comment'} />
                )}
            </div>

            <div className="comment-description">{comment.describtion}</div>
            <br />
            {comment.file && <img src={comment.file} alt="Comment" className="comment-image1" />}

            <div className="comment-actions">
                <LikeButton id={comment._id} isLiked={isLiked} setIsLiked={setIsLiked} setLikes={setLikes} likes={likes} symbol={'Comment'} />
                <div className="comment-reply-button" onClick={handleVisible}>Reply</div>
            </div>

            <div className="comment-likes-comments">
                {likes > 0 && (
                    <div onClick={setData} className="comment-likes-container">
                        <p className="comment-likes-count">{likes}</p>
                        <FontAwesomeIcon icon={faThumbsUp} className="comment-like-icon" />
                    </div>
                )}
                {/* {comment.replies > 0 && <div className="comment-comments-count">{comment.replies} replies</div>} */}
            </div>
            <div style={{ cursor: "pointer", marginTop: "10px", color: "#1877f2" }} onClick={showReplies}>show replies</div>

            {replies.length > 0 && (
                <RepliesList
                    setReplies={setReplies}
                    setIsReplyFormVisible={setIsReplyFormVisible}
                    setUser={setUser}
                    replies={replies}
                    setId={setId}
                    setSymbol={setSymbol}
                />
            )}

            {isReplyFormVisible && (
                <ReplyForm
                    key={user.id}
                    commentId={comment._id}
                    user={user}
                    setIsReplyFormVisible={setIsReplyFormVisible}
                    handleAddedReply={handleAddedReply}
                />
            )}
            {/* {reacts && <ReactedUsers reacts={reacts} />} */}
        </div>




    );
}