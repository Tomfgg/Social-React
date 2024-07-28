import React, { useContext, useState } from 'react';
import './PostForm.css';
import { AuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

const PostForm = () => {
    const navigate = useNavigate()
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const { AuthToken } = useContext(AuthContext)
    const [fullfilled, setFullfilled] = useState(false)

    const handleDescriptionChange = (e) => {
        if (e.target.value.length > 200) return
        setDescription(e.target.value);
    };


    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 5) {
            alert('You can only upload up to 5 files.');
            return;
        }
        if (selectedFiles.length + files.length === 5) setFullfilled(true)
        setFiles([...files, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
        if(fullfilled) setFullfilled(false)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
        const formData = new FormData();
        formData.append('describtion', description);
        files.forEach((file, index) => {
            formData.append('file', file); // 'files' is the key for your files array
        });

        await fetch('https://social-app-f6f0.onrender.com/posts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AuthToken}`, // Ensure AuthToken is defined and valid
            },
            body: formData,
        });
        setDescription('')
        setFiles([])
        navigate('/profile')
    };

    return (
        <div className="container">
            <form className="post-add-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={handleDescriptionChange} />
                </div>

                {!fullfilled && (
                    <div className="form-group">
                        <label htmlFor="fileUpload">Upload Images/Videos:</label>
                        <input id="fileUpload" type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
                    </div>
                )}

                <div className="preview">
                    {files.length > 0 && (
                        <div>
                            <h3>Preview:</h3>
                            <div className="preview-items">
                                {files.map((file, index) => (
                                    <div key={index} className="preview-item">
                                        {file.type.startsWith('image/') ? (
                                            <img src={URL.createObjectURL(file)} alt={`preview ${index}`} width="100" />
                                        ) : (
                                            <video width="100" controls>
                                                <source src={URL.createObjectURL(file)} type={file.type} />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                        <button type="button" onClick={() => handleRemoveFile(index)}>X</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="form-buttons">
                <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
                <button disabled={files.length === 0 && !description} type="submit" className="submit-button">Post</button>
            </div>
            </form>
        </div>


    );
};

export default PostForm;
