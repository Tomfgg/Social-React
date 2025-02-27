import { createContext, useContext, useEffect, useState } from "react"
import LikeButton from "./LikeButton"
import ReactedUsers from "./ReactedUsers"
import CommentsList from "./CommentsList"
import { AuthContext } from "./AuthProvider"
import Owner from "./Owner"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import './PostComponent.css';
import PostModal from "./PostModal"
import InnerSinglePost from "./InnerSinglePost"
import ReactsModal from "./ReactsModal"
import InnerReactsModal from "./InnerReactsModal"
import DropdownButton from "./DropdownButton"
import CommentForm from "./CommentForm"
import './SinglePost.css'
import MediaCarousel from './MediaCarousel'

export const CommentsCountContext = createContext(null)

export default function SinglePost({ post, postsSetter, decrementSkip }) {
    const { AuthToken, currentUser } = useContext(AuthContext)
    const [likes, setLikes] = useState(post.likes)
    const [isLiked, setIsLiked] = useState(post.liked)
    const [reacts, setReacts] = useState(null)
    const [comments, setComments] = useState([])
    const [skip, setSkip] = useState(0)
    const [scrollDisabled, setScrollDisabled] = useState(false)
    const [noMoreComments, setNoMoreComments] = useState(false)
    const [id, setId] = useState(null)
    const [symbol, setSymbol] = useState(null)
    const [commentsCount, setCommentsCount] = useState(post.comments)
    const [index, setIndex] = useState(0)
    // const [skip, setSkip] = useState(0)
    // const [toFetch,setToFetch] = useState(false)
    // console.log(post.user_id.image)
    if (post.images.length > 0) {
        var imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        var media = imageExtensions.some((ext) => post.images[index].toLowerCase().endsWith(ext)) ?
            <img className="post-image" src={post.images[index]} /> : <video className="post-image" controls>
                <source src={post.images[index]} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
    }

    console.log(post)
    console.log(comments)

    const incrementComments = () => {
        setCommentsCount(commentsCount + 1)
    }

    const decrementComments = (newCount) => {
        if (newCount || newCount === 0) setCommentsCount(newCount)
        else setCommentsCount(commentsCount - 1)
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isReactsModalVisible, setIsReactsModalVisible] = useState(false);

    const handleNewComment = (addedComment) => {
        setComments([addedComment, ...comments])
        setSkip(skip + 1)
    }

    const openModal = async () => {
        let newComments = await fetch(`https://social-app-f6f0.onrender.com/comments/${post._id}?skip=${skip}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AuthToken}`,
            },
        })
        if (newComments.ok) {
            newComments = await newComments.json()
            if (newComments.length < 5) setNoMoreComments(true)
            console.log(newComments)
            setComments([...newComments])
            if (scrollDisabled) setScrollDisabled(false)
            setSkip(skip + 5)
        }
        else setScrollDisabled(true)
        setIsModalVisible(true);
    };

    const getOtherComments = async () => {
        if (!scrollDisabled) {
            let otherComments = await fetch(`https://social-app-f6f0.onrender.com/comments/${post._id}?skip=${skip}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AuthToken}`,
                },
            })
            if (otherComments.ok) {
                otherComments = await otherComments.json()
                if (otherComments.length < 5) setNoMoreComments(true)
                console.log(otherComments)
                setComments([...comments, ...otherComments])
                setSkip(skip + 5)
            }
        }
    }

    const closeModal = () => {
        setIsModalVisible(false);
        setSkip(0)
        setNoMoreComments(false)
        // setComments([])
    };

    const openReactsModal = async () => {
        let reacts = await fetch(`https://social-app-f6f0.onrender.com/users/Post/${post._id}`)
        reacts = await reacts.json()
        setReacts(reacts)
        setIsReactsModalVisible(true)
    }

    const closeReactsModal = () => {
        setIsReactsModalVisible(false)
        setReacts(null)
    }

    const showReacts = async () => {
        let reacts = await fetch(`https://social-app-f6f0.onrender.com/users/Post/${post._id}`)
        reacts = await reacts.json()
        setReacts(reacts)
    }

    const hideReacts = () => {
        setReacts(null)
    }

    const showComments = async () => {
        let newComments = await fetch(`https://social-app-f6f0.onrender.com/comments/${post._id}?skip=0`, {
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
        fetch(`https://social-app-f6f0.onrender.com/posts/${post._id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${AuthToken}`
            }
        })
        postsSetter(post)
        decrementSkip()
    }

    // useEffect(()=>{
    //     if(toFetch) {
    //         const showReacts = async () => {
    //             let reacts = await fetch(`https://social-app-f6f0.onrender.com/users/Post/${post._id}`)
    //             reacts = await reacts.json()
    //             setReacts(reacts)
    //         }
    //         showReacts()
    //     }
    //     else {
    //         setReacts(null)
    //     }

    // }, [post._id])
    if (!post) return null

    return (
        <div className="post-container">
            <div className="post-header">
                <Owner theUser={post.user_id ? post.user_id : null} date={post.createdAt} />
                {/* {post.createdAt && <div>{formatRelativeDate(post.createdAt)}</div>} */}
                {(currentUser._id === post.user_id?._id || !post.user_id) &&
                    <DropdownButton settings={'post'} id={post._id} handleDelete={handleDeletePost} />}
            </div>
            <p className="post-description">{post.describtion}</p>
            {(post.images.length > 0) && post.images.length > 1 ? <div className="container">
                <button disabled={index === post.images.length - 1} onClick={() => setIndex(index + 1)} className="nav-button" id="prev">{'<'}</button>
                {media}
                <button disabled={index === 0} onClick={() => setIndex(index - 1)} className="nav-button" id="next">{'>'}</button>
            </div> : media}

            <div className="likes-comments-container">

                <div
                    onClick={openReactsModal}
                    className="likes-container"
                >
                    <p className="likes-count">{likes}</p>
                    {likes > 0 && <FontAwesomeIcon
                        icon={faThumbsUp}
                        className="like-icon"
                    />}
                </div>

                {commentsCount > 0 && <div className="comments-count">{commentsCount} comments</div>}
            </div>

            {/* {reacts && <ReactedUsers reacts={reacts} />} */}

            <div className="actions-container">
                <LikeButton isLiked={isLiked} setIsLiked={setIsLiked} id={post._id} setLikes={setLikes} likes={likes} symbol={'Post'} />
                <div onClick={openModal} className="comments-button">Comment</div>
            </div>
            {/* <CommentsList comments={comments} /> */}

            <CommentsCountContext.Provider value={{ incrementComments, decrementComments }}>
                <PostModal isVisible={isModalVisible} onClose={closeModal} id={post._id}>
                    <InnerSinglePost commentsCount={commentsCount} post={{ ...post, likes, liked: isLiked }} setIsLiked={setIsLiked} setLikes={setLikes} setId={setId} setSymbol={setSymbol} />
                    <CommentsList noMoreComments={noMoreComments} getOtherComments={getOtherComments} skip={skip} setSkip={setSkip} setComments={setComments} comments={comments} setId={setId} setSymbol={setSymbol} />
                    <InnerReactsModal id={id} symbol={symbol} setId={setId} setSymbol={setSymbol} />
                    <CommentForm id={id} postId={post._id} handleAddedComment={handleNewComment} />
                </PostModal>
            </CommentsCountContext.Provider>

            {/* <PostModal isVisible={isModalVisible} onClose={closeModal} id={post._id}>
                <InnerSinglePost post={{ ...post, likes, liked: isLiked }} setIsLiked={setIsLiked} setLikes={setLikes} setId={setId} setSymbol={setSymbol} />
                <CommentsList setComments={setComments} comments={comments} setId={setId} setSymbol={setSymbol} />
                <InnerReactsModal id={id} symbol={symbol} setId={setId} setSymbol={setSymbol} />
                <CommentForm postId={post._id} handleAddedComment={handleNewComment} />
            </PostModal> */}

            <ReactsModal isVisible={isReactsModalVisible} onClose={closeReactsModal}>
                <ReactedUsers reacts={reacts} />
            </ReactsModal>

        </div>
    );
}
