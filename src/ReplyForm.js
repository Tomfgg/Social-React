import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthProvider';
import './ReplyForm.css'    
// import CloseButton from 'react-bootstrap/CloseButton';
import { CommentsCountContext } from './SinglePost'

const ReplyForm = ({ commentId, handleAddedReply, user, setIsReplyFormVisible }) => {
    const {incrementComments} = useContext(CommentsCountContext)
    const [description, setDescription] = useState(user.name+' ');
    const [file, setFile] = useState(null);
    const { AuthToken, currentUser } = useContext(AuthContext)
    console.log(user)

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
                image: currentUser.image?.replace("http://127.0.0.1:5000/profileImage/", "")
            }
            console.log(addedReply);        
            // Handle success (e.g., clear the form, show a success message, etc.)
            setDescription('');
            setFile(null);
            handleAddedReply(addedReply)
            setIsReplyFormVisible(false)
            incrementComments()
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <form className="reply-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <textarea
                    placeholder="Write a reply..."
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </div>
            
            <div className="form-group flex">
                {!file ? <input type="file" accept="image/*" onChange={handleFileChange} className="pxfile-input" /> : <div className="pxcomment-edit-file-preview">
                    <img src={URL.createObjectURL(file)} alt="New File" className="pxcomment-edit-preview-image" />
                    <button type="button" onClick={() => setFile(null)} className="pxcomment-edit-remove-button">Remove</button>
                </div>}
                <button type="submit" className="submit-button">Reply</button>
            </div>
            {/* <CloseButton /> */}
        </form>
    );
};

export default ReplyForm;
