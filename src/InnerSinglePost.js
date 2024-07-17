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


export default function InnerSinglePost({ post, setLikes, setIsLiked, setId ,setSymbol}) {
    const { currentUser } = useContext(AuthContext)
    // const [likes, setLikes] = useState(post.likes)
    // const [isLiked, setIsLiked] = useState(post.liked)
    const [reacts, setReacts] = useState(null)
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
            <Owner theUser={post.user_id} settings={'post'}/>
            {/* {(currentUser._id === post.user_id?._id || !post.user_id) && <DropdownButton settings={'post'} />} */}
            <p className="post-description">{post.describtion}</p>
            {post.images.length > 0 &&<img src={post.images[0]} alt="Post" className="post-image" />}

            <div className="likes-comments-container">
                {post.likes > 0 && (
                    <div
                        onClick={setForPostReacts}
                        className="likes-container"
                    >
                        <p className="likes-count">{post.likes}</p>
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            className="like-icon"
                        />
                    </div>
                )}
                {post.comments > 0 && <div className="comments-count">{post.comments} comments</div>}
            </div>

            <div className="actions-container">
                <LikeButton isLiked={post.liked} setIsLiked={setIsLiked} id={post._id} setLikes={setLikes} likes={post.likes} symbol={'Post'} />
                <button className="comments-button">Comment</button>
            </div>

            
        </div>
    );
}