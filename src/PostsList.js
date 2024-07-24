import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthProvider";
import SinglePost from "./SinglePost";
import './PostsList.css'

export default function PostsList({ editable, whosePosts }) {
    const { AuthToken } = useContext(AuthContext)
    const [posts, setPosts] = useState(null)
    const [skip, setSkip] = useState(0)
    const [noMorePosts, setNoMorePosts] = useState(false)
    if (!whosePosts) whosePosts = ''
    useEffect(() => {
        async function fetchPosts() {
            let posts = await fetch(`http://127.0.0.1:5000/posts/${whosePosts}?skip=${skip}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AuthToken}`,
                },
            });
            posts = await posts.json()
            console.log(posts)
            setPosts(posts)
            if (posts.length < 5) setNoMorePosts(true)
            setSkip(skip + 5)
        }
        fetchPosts()
    }, [])

    // console.log(noMorePosts)

    const decrementSkip = ()=>{
        setSkip(skip-1)
    }

    const postsSetter = (thePost) => {
        const newPosts = posts.filter(post => post._id !== thePost._id)
        setPosts(newPosts)
    }

    const importSomePosts = async () => {
        if (!noMorePosts) {
            let newPosts = await fetch(`http://127.0.0.1:5000/posts/${whosePosts}?skip=${skip}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AuthToken}`,
                },
            });
            newPosts = await newPosts.json()
            console.log(newPosts)
            setPosts([...posts, ...newPosts])
            if (newPosts.length < 5) setNoMorePosts(true)
            setSkip(skip + 5)
        }
    }

    return (<>
        <ul>
            {
                posts && posts.map(post => (
                    <div key={post._id}>
                        <SinglePost decrementSkip={decrementSkip} post={post} postsSetter={postsSetter} />
                    </div>
                )
                )
            }
        </ul>
        {!noMorePosts && <div className="show-more" onClick={importSomePosts}>Show More</div>}
    </>)
}