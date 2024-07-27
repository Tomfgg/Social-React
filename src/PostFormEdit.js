import React, { useContext, useEffect, useState } from 'react';
import './PostForm.css';
import { AuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

const PostFormEdit = (id) => {
    const navigate = useNavigate()
    const [description, setDescription] = useState('');
    const [oldFiles, setOldFiles] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([])
    const [newFiles, setNewFiles] = useState([])
    const { AuthToken } = useContext(AuthContext)
    const [fullfilled, setFullfilled] = useState(false)

    console.log(oldFiles)
    console.log(newFiles)
    console.log(deletedFiles)

    useEffect(() => {
        async function fetchPost() {
            console.log(id.id)
            let post = await fetch(`http://127.0.0.1:5000/posts/${id.id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${AuthToken}`
                }
            })
            post = await post.json()
            console.log(post)
            setDescription(post.describtion)
            setOldFiles(post.images)
            if (post.images.length === 5) setFullfilled(true)
        }
        fetchPost()
    }, [])


    const handleDescriptionChange = (e) => {
        if (e.target.value.length > 200) return
        setDescription(e.target.value);
    };


    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        console.log(selectedFiles)
        if (selectedFiles.length + newFiles.length + oldFiles.length > 5) {
            alert('You can only upload up to 5 files.');
            return;
        }
        if (selectedFiles.length + newFiles.length + oldFiles.length === 5) setFullfilled(true)
        setNewFiles([...newFiles, ...selectedFiles]);
    };

    const handleRemoveNewFile = (index) => {
        setNewFiles(newFiles.filter((_, i) => i !== index));
        if (fullfilled) setFullfilled(false)
    };

    const handleRemoveOldFile = (theFile) => {
        setOldFiles(oldFiles.filter((file) => file !== theFile));
        setDeletedFiles([...deletedFiles, (theFile.replace('http://127.0.0.1:5000/postfile/', ''))])
        if (fullfilled) setFullfilled(false)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
        const formData = new FormData();
        formData.append('describtion', description);
        // formData.append('file', newFiles);
        // formData.append('toDelete', deletedFiles);

        newFiles.forEach((file) => {
            formData.append('file', file); // 'files' is the key for your files array
        });

        deletedFiles.forEach((file) => {
            formData.append('toDelete', file); // 'files' is the key for your files array
        });


        await fetch(`http://127.0.0.1:5000/posts/${id.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${AuthToken}`, // Ensure AuthToken is defined and valid
            },
            body: formData,
        });
        return navigate('/profile')
    };

    return (
        <div className="container">
            <form className="post-add-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={handleDescriptionChange} />
                </div>
                {!fullfilled && <div className="form-group">
                    <label htmlFor="fileUpload">Upload Images/Videos:</label>
                    <input id="fileUpload" type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
                </div>}
                <div className="preview">
                    {newFiles.length > 0 && (
                        <div>
                            <h3>Preview new files:</h3>
                            <div className="preview-items">
                                {newFiles.map((file, index) => (
                                    <div key={index} className="preview-item">
                                        {file.type.startsWith('image/') ? (
                                            <img src={URL.createObjectURL(file)} alt={`preview ${index}`} width="100" />
                                        ) : (
                                            <video width="100" controls>
                                                <source src={URL.createObjectURL(file)} type={file.type} />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                        <button type="button" onClick={() => handleRemoveNewFile(index)}>X</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {oldFiles.length > 0 && (
                        <div>
                            <h3>Preview old files:</h3>
                            <div className="preview-items">
                                {oldFiles.map((file, index) => (
                                    <div key={index} className="preview-item">
                                        {file.endsWith('.jpg') || file.endsWith('.png') ? (
                                            <img src={file} alt={`preview ${index}`} width="100" />
                                        ) : (
                                            <video width="100" controls>
                                                <source src={file} type={file.type} />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                        <button type="button" onClick={() => handleRemoveOldFile(file)}>X</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="form-buttons">
                    <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
                    <button disabled={oldFiles.length === 0 && newFiles.length === 0 && !description} type="submit" className="submit-button">Post</button>
                </div>
            </form>
        </div>
    );
};

export default PostFormEdit;
