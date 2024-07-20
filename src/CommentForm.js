import React, { useContext, useState } from 'react';
import './CommentForm.css'
import { AuthContext } from './AuthProvider';

const CommentForm = ({ postId, handleAddedComment }) => {
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const { AuthToken,currentUser } = useContext(AuthContext)

    const handleDescriptionChange = (e) => {
        if (e.target.value.length > 200) return
        setDescription(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('describtion', description);
        if (file) {
            formData.append('file', file);
        }
        console.log(postId)
        try {
            const response = await fetch(`http://127.0.0.1:5000/comments/${postId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AuthToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const addedComment = await response.json();
            console.log(currentUser.image)
            addedComment.user_id = {
                _id: currentUser._id,
                name: currentUser.name,
                image: currentUser.image.replace("http://127.0.0.1:5000/profileImage/", "")
            }
            console.log(addedComment);
            // Handle success (e.g., clear the form, show a success message, etc.)
            setDescription('');
            setFile(null);
            handleAddedComment(addedComment)
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <textarea
                    placeholder="Write a comment..."
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </div>
            <div className="form-group">
                <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
            </div>
            <button type="submit" className="submit-button">Comment</button>
        </form>
    );
};

export default CommentForm;
