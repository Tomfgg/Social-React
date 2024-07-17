import React, { useContext, useState } from 'react';
import './PostForm.css';
import { AuthContext } from './AuthProvider';

const PostForm = () => {
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const {AuthToken} = useContext(AuthContext)

    const handleDescriptionChange = (e) => {
        if(e.target.value.length > 200) return
        setDescription(e.target.value);
    };


    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 5) {
            alert('You can only upload up to 5 files.');
            return;
        }
        setFiles([...files, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        const formData = new FormData();
        formData.append('describtion', description);
        files.forEach((file, index) => {
            formData.append('file', file); // 'files' is the key for your files array
        });

        fetch('http://127.0.0.1:5000/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AuthToken}`, // Ensure AuthToken is defined and valid
                },
                body: formData,
            });
        setDescription('')
        setFiles([])
    };

    return (
        <form className="post-add-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea id="description" value={description} onChange={handleDescriptionChange} />
            </div>
            <div className="form-group">
                <label htmlFor="fileUpload">Upload Images/Videos:</label>
                <input id="fileUpload" type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
            </div>
            <div className="preview">
                {files.length > 0 && (
                    <div>
                        <h3>Preview:</h3>
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
                                <button type="button" onClick={() => handleRemoveFile(index)}>Remove</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button type="submit" className="submit-button">Post</button>
        </form>
    );
};

export default PostForm;
