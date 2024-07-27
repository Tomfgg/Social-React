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
import DropdownButton from "./DropdownButton"


export default function InnerSinglePost({ post, setLikes, setIsLiked, setId, setSymbol, commentsCount }) {
    const { currentUser } = useContext(AuthContext)
    // const [likes, setLikes] = useState(post.likes)
    // const [isLiked, setIsLiked] = useState(post.liked)
    const [reacts, setReacts] = useState(null)
    const [index, setIndex] = useState(0)
    if (post.images.length > 0) {
        var imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        var media = imageExtensions.some((ext) => post.images[index].toLowerCase().endsWith(ext)) ?
            <img className="post-image" src={post.images[index]} /> : <video className="post-image" controls>
                <source src={post.images[index]} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
    }
    // const [comments, setComments] = useState([])
    // const [skip, setSkip] = useState(0)
    // const [toFetch,setToFetch] = useState(false)

    // const [isModalVisible, setIsModalVisible] = useState(false);
    const setForPostReacts = ()=>{
        setId(post._id)
        setSymbol('Post')
    }

    // const openModal = async () => {
    //     let newComments = await fetch(`http://127.0.0.1:5000/comments/${post._id}?skip=0`, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${AuthToken}`,
    //         },
    //     })
    //     newComments = await newComments.json()
    //     console.log([...newComments])
    //     setComments([...newComments])
    //     setIsModalVisible(true);
    // };

    // const closeModal = () => {
    //     setIsModalVisible(false);
    // };

    const showReacts = async () => {
        let reacts = await fetch(`http://127.0.0.1:5000/users/Post/${post._id}`)
        reacts = await reacts.json()
        setReacts(reacts)
    }

    const hideReacts = () => {
        setReacts(null)
    }

    // const showComments = async () => {
    //     let newComments = await fetch(`http://127.0.0.1:5000/comments/${post._id}?skip=0`, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${AuthToken}`,
    //         },
    //     })
    //     newComments = await newComments.json()
    //     console.log([...newComments])
    //     setComments([...newComments])
    //     // setSkip(skip + 3)
    // }

    

    return (
        <div className="post-container">
            <Owner theUser={post.user_id} date={post.createdAt} settings={'post'}/>
            {/* {(currentUser._id === post.user_id?._id || !post.user_id) && <DropdownButton settings={'post'} />} */}
            <p className="post-description">{post.describtion}</p>
            {(post.images.length > 0) && post.images.length > 1 ? <div className="container">
                <button disabled={index === post.images.length - 1} onClick={() => setIndex(index + 1)} className="nav-button" id="prev">{'<'}</button>
                {media}
                <button disabled={index === 0} onClick={() => setIndex(index - 1)} className="nav-button" id="next">{'>'}</button>
            </div> : media}

            <div className="likes-comments-container">
                 
                    <div
                        onClick={setForPostReacts}
                        className="likes-container"
                    >
                        <p className="likes-count">{post.likes}</p>
                        {post.likes > 0 &&<FontAwesomeIcon
                            icon={faThumbsUp}
                            className="like-icon"
                        />}
                    </div>
                
                {commentsCount > 0 && <div className="comments-count">{commentsCount} comments</div>}
            </div>

            <div className="actions-container">
                <LikeButton isLiked={post.liked} setIsLiked={setIsLiked} id={post._id} setLikes={setLikes} likes={post.likes} symbol={'Post'} />
                <div className="comments-button">Comment</div>
            </div>

            
        </div>
    );
}