import { useContext, useState } from "react"
import { AuthContext } from "./AuthProvider";

const CommentFormEdit = ({ comment, setEditable, setComment, type }) => {
    const [describtion, setDescribtion] = useState(comment.describtion)
    const [oldFile, setOldFile] = useState(comment.file)
    const [newFile, setNewFile] = useState(null)
    const { AuthToken, currentUser } = useContext(AuthContext)
    console.log(comment)
    console.log(newFile)

    const handleDescribtionChange = (e) => {
        if (e.target.value.length > 200) return
        setDescribtion(e.target.value);
    };

    const handleRemoveOldFile = () => {
        setOldFile(null)
    }
    const handleRemoveNewFile = () => {
        setNewFile(null)
    }

    const handleFileChange = (e) => {
        setNewFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
        const formData = new FormData();
        formData.append('describtion', describtion);
        if (newFile) formData.append('file', newFile);
        if (oldFile) formData.append('oldFile', oldFile);

        // if (newFile) formData.append('file', newFile); // 'files' is the key for your files array

        // formData.append('oldFile', oldFile); // 'files' is the key for your files array


        let newComment = await fetch(`http://127.0.0.1:5000/${type}/${comment._id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${AuthToken}`, // Ensure AuthToken is defined and valid
            },
            body: formData,
        });
        newComment = await newComment.json()
        newComment.user_id = {
            _id: currentUser._id,
            name: currentUser.name
        }
        console.log(newComment)
        setEditable(false)
        setComment(newComment)
    }

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <textarea
                    placeholder="Write a comment..."
                    value={describtion}
                    onChange={handleDescribtionChange}
                />
            </div>

            {oldFile ? <div>
                <img src={oldFile} width="100" />
                <button type="button" onClick={() => handleRemoveOldFile()}>Remove</button>
            </div> : newFile ? <div>
                <img src={URL.createObjectURL(newFile)} width="50" />
                <button type="button" onClick={() => handleRemoveNewFile()}>Remove</button>
            </div> :
                <div className="form-group">
                    <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
                </div>}

            <button type="submit" onClick={handleSubmit} className="submit-button">edit</button>
            <button type="submit" onClick={() => setEditable(false)} className="submit-button">cancel</button>
        </form>
    );
}

export default CommentFormEdit