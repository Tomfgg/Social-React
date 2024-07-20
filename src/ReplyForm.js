import React, { useContext, useState } from 'react';
import './CommentForm.css'
import { AuthContext } from './AuthProvider';
import './CommentForm.css'

const ReplyForm = ({ commentId, handleAddedReply, user, setIsReplyFormVisible }) => {
    const [description, setDescription] = useState(user.name+' ');
    const [file, setFile] = useState(null);
    const { AuthToken, currentUser } = useContext(AuthContext)

    const handleDescriptionChange = (e) => {
        if (!e.target.value.startsWith(user.name)) return
        if (e.target.value.length > 200) return
        setDescription(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const descToBeSent = description.slice(user.name.length)
        const formData = new FormData();
        formData.append('describtion', descToBeSent);
        formData.append('toWhoID',user.id)
        formData.append('toWhoName',user.name)
        if (file) {
            formData.append('file', file);
        }
        console.log(commentId)
        try {
            const response = await fetch(`http://127.0.0.1:5000/replies/${commentId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AuthToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const addedReply = await response.json();
            addedReply.user_id = {
                _id: currentUser._id,
                name: currentUser.name,
                image: currentUser.image.replace("http://127.0.0.1:5000/profileImage/", "")
            }
            console.log(addedReply);        
            // Handle success (e.g., clear the form, show a success message, etc.)
            setDescription('');
            setFile(null);
            handleAddedReply(addedReply)
            setIsReplyFormVisible(false)
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
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <button type="submit" className="submit-button">Comment</button>
        </form>
    );
};

export default ReplyForm;
