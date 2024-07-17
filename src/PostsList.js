import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthProvider";
import SinglePost from "./SinglePost";

export default function PostsList({ editable,whosePosts}) {
    const { AuthToken } = useContext(AuthContext)
    const [posts, setPosts] = useState(null)
    if(!whosePosts) whosePosts=''
    useEffect(() => {
        async function fetchPosts() {
            let posts = await fetch(`http://127.0.0.1:5000/posts/${whosePosts}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AuthToken}`,
                },
            });
            posts = await posts.json()
            console.log(posts)
            setPosts(posts)
        }
        fetchPosts()
    }, [])

    const postsSetter = (thePost)=>{
        const newPosts = posts.filter(post=>post._id !== thePost._id)
        setPosts(newPosts)
    }

    return (<>
        <ul>
            {
                posts && posts.map(post => (
                    <div key={post._id}>
                        <SinglePost post={post} postsSetter={postsSetter} />
                    </div>
                )
                )
            }
        </ul>
    </>)
}