import { useContext, useEffect, useState } from "react"
import LikeButton from "./LikeButton"
import ReactedUsers from "./ReactedUsers"
import CommentsList from "./CommentsList"
import { AuthContext } from "./AuthProvider"
import Owner from "./Owner"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './PostComponent.css';
import PostModal from "./PostModal"
import InnerSinglePost from "./InnerSinglePost"
import ReactsModal from "./ReactsModal"
import InnerReactsModal from "./InnerReactsModal"
import DropdownButton from "./DropdownButton"
import CommentForm from "./CommentForm" 
import './SinglePost.css'

export default function SinglePost({ post, postsSetter }) {
    const { AuthToken, currentUser } = useContext(AuthContext)
    const [likes, setLikes] = useState(post.likes)
    const [isLiked, setIsLiked] = useState(post.liked)
    const [reacts, setReacts] = useState(null)
    const [comments, setComments] = useState([])
    const [id, setId] = useState(null)
    const [symbol, setSymbol] = useState(null)
    // const [skip, setSkip] = useState(0)
    // const [toFetch,setToFetch] = useState(false)
    // console.log(post.user_id.image)
    console.log(post)
    console.log(comments)

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isReactsModalVisible, setIsReactsModalVisible] = useState(false);

    const handleNewComment = (addedComment) => {
        setComments([addedComment,...comments])
    }

    const openModal = async () => {
        let newComments = await fetch(`http://127.0.0.1:5000/comments/${post._id}?skip=0`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AuthToken}`,
            },
        })
        newComments = await newComments.json()
        console.log(newComments)
        setComments([...newComments])
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        // setComments([])
    };

    const openReactsModal = async () => {
        let reacts = await fetch(`http://127.0.0.1:5000/users/Post/${post._id}`)
        reacts = await reacts.json()
        setReacts(reacts)
        setIsReactsModalVisible(true)
    }

    const closeReactsModal = () => {
        setIsReactsModalVisible(false)
        setReacts(null)
    }

    const showReacts = async () => {
        let reacts = await fetch(`http://127.0.0.1:5000/users/Post/${post._id}`)
        reacts = await reacts.json()
        setReacts(reacts)
    }

    const hideReacts = () => {
        setReacts(null)
    }

    const showComments = async () => {
        let newComments = await fetch(`http://127.0.0.1:5000/comments/${post._id}?skip=0`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AuthToken}`,
            },
        })
        newComments = await newComments.json()
        console.log([...newComments])
        setComments([...newComments])
        // setSkip(skip + 3)
    }

    const handleDeletePost = () => {
        fetch(`http://127.0.0.1:5000/posts/${post._id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${AuthToken}`
            }
        })
        postsSetter(post)
    }

    // useEffect(()=>{
    //     if(toFetch) {
    //         const showReacts = async () => {
    //             let reacts = await fetch(`http://127.0.0.1:5000/users/Post/${post._id}`)
    //             reacts = await reacts.json()
    //             setReacts(reacts)
    //         }
    //         showReacts()
    //     }
    //     else {
    //         setReacts(null)
    //     }

    // }, [post._id])
    if(!post) return null

    return (
        <div className="post-container">
            <div className="post-header">
                <Owner theUser={post.user_id ? post.user_id:null} date={post.createdAt}/>
                {/* {post.createdAt && <div>{formatRelativeDate(post.createdAt)}</div>} */}
                {(currentUser._id === post.user_id?._id || !post.user_id) &&
                    <DropdownButton settings={'post'} id={post._id} handleDelete={handleDeletePost} />}
            </div>
            <p className="post-description">{post.describtion}</p>
            {post.images.length > 0 && <img src={post.images[0]} alt="Post" className="post-image" />}

            <div className="likes-comments-container">
                {likes > 0 && (
                    <div
                        onClick={openReactsModal}
                        className="likes-container"
                    >
                        <p className="likes-count">{likes}</p>
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            className="like-icon"
                        />
                    </div>
                )}
                {post.comments > 0 && <div className="comments-count">{post.comments} comments</div>}
            </div>

            {/* {reacts && <ReactedUsers reacts={reacts} />} */}

            <div className="actions-container">
                <LikeButton isLiked={isLiked} setIsLiked={setIsLiked} id={post._id} setLikes={setLikes} likes={likes} symbol={'Post'} />
                <button onClick={openModal} className="comments-button">Comment</button>
            </div>
            {/* <CommentsList comments={comments} /> */}

            <PostModal isVisible={isModalVisible} onClose={closeModal} id={post._id}>
                <InnerSinglePost post={{ ...post, likes, liked: isLiked }} setIsLiked={setIsLiked} setLikes={setLikes} setId={setId} setSymbol={setSymbol} />
                <CommentsList setComments={setComments} comments={comments} setId={setId} setSymbol={setSymbol} />
                <InnerReactsModal id={id} symbol={symbol} setId={setId} setSymbol={setSymbol} />
                <CommentForm postId={post._id} handleAddedComment = {handleNewComment}/>
            </PostModal>

            <ReactsModal isVisible={isReactsModalVisible} onClose={closeReactsModal}>
                <ReactedUsers reacts={reacts} />
            </ReactsModal>

        </div>
    );
}
