import Owner from "./Owner"
import LikeButton from "./LikeButton"
import SingleComment from "./SingleComment"
import './CommentsList.css'
export default function CommentsList({ comments, setId, setSymbol,setComments }) {
    // console.log(comments)

    const commentsSetter = (theComment) => {
        const newComments = comments.filter(comment => comment._id !== theComment._id)
        setComments(newComments)
    }
    
    return (
        <ul className="scrollable-container">
            {comments.map(comment => (
                <div key={comment._id}>
                    {/* <Owner user={comment.user_id}/>
                    <p>{comment.describtion}</p>
                    <img src={comment.file} alt="Post" /> */}
                    {/* <LikeButton liked={comment.liked} id={comment._id} setLikes={setLikes} likes={likes}  /> */}
                    {/* <LikeButton liked={post.liked} id={post._id} setLikes={setLikes} likes={likes} /> */}
                    <SingleComment  commentsSetter={commentsSetter} commentSent={comment} setId={setId} setSymbol={setSymbol} />
                </div>
            ))}
        </ul>
    )
}