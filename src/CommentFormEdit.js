import { useContext, useState } from "react"
import { AuthContext } from "./AuthProvider";
import './CommentFormEdit.css'

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
        // if (newComment.file) newComment.file = 'http://127.0.0.1:5000/commentfile/' + newComment.file
        newComment.user_id = {
            _id: currentUser._id,
            name: currentUser.name,
            image: currentUser.image?.replace('http://127.0.0.1:5000/profileImage/', '')
        }
        console.log(newComment)
        setEditable(false)
        setComment(newComment)
    }

    return (
        <form className="comment-edit-form" onSubmit={handleSubmit}>
            <div className="comment-edit-form-group">
                <textarea
                    placeholder="Write a comment..."
                    value={describtion}
                    onChange={handleDescribtionChange}
                    className="comment-edit-textarea"
                />
            </div>

            {oldFile ? (
                <div className="comment-edit-file-preview">
                    <img src={oldFile} alt="Old File" className="comment-edit-preview-image" />
                    <button type="button" onClick={handleRemoveOldFile} className="comment-edit-remove-button">Remove</button>
                </div>
            ) : newFile ? (
                <div className="comment-edit-file-preview">
                    <img src={URL.createObjectURL(newFile)} alt="New File" className="comment-edit-preview-image" />
                    <button type="button" onClick={handleRemoveNewFile} className="comment-edit-remove-button">Remove</button>
                </div>
            ) : (
                <div className="comment-edit-form-group">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="comment-edit-file-input" />
                </div>
            )}

            <div className="comment-edit-button-group">
                <button type="button" onClick={() => setEditable(false)} className="comment-edit-cancel-button">Cancel</button>
                <button disabled={!oldFile&&!newFile&&!describtion} type="submit" onClick={handleSubmit} className="comment-edit-submit-button">Edit</button>
            </div>
        </form>

    );
}

export default CommentFormEdit