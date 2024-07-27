import { useContext, useState, useEffect } from "react"
import { AuthContext } from "./AuthProvider";
import defaultProfileImage from './assets/profile.webp'
import { Link, redirect, useNavigate } from "react-router-dom";
import './ProfileFormEdit.css'

const ProfileFormEdit = () => {
    const navigate = useNavigate();
    const { AuthToken, currentUser, setCurrentUser } = useContext(AuthContext)
    console.log(currentUser)
    const [name, setName] = useState(null)
    const [oldImage, setOldImage] = useState(null)
    const [newImage, setNewImage] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name);
            setOldImage(currentUser.image)
            setLoading(false);
        }
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log(oldImage)
    console.log(newImage)

    const src = oldImage ? oldImage : newImage ? URL.createObjectURL(newImage) : defaultProfileImage

    console.log(currentUser)
    // console.log(newFile)

    const handleNameChange = (e) => {
        if (e.target.value.length > 200) return
        setName(e.target.value);
    };

    const handleRemove = () => {
        if (oldImage) setOldImage(null)
        if (newImage) setNewImage(null)
    }
    // const handleRemoveNewFile = () => {
    //     setNewFile(null)
    // }

    const handleFileChange = (e) => {
        if (oldImage) setOldImage(null)
        setNewImage(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name.length < 3 || name.length > 15) {
            setError('Username should have be between 3 and 15 characters');
            return;
        }
        const nameRegex = /^(?! )[A-Za-z]+(?: [A-Za-z]+)*(?<! )$/;
        if (!nameRegex.test(name)) {
            setError('Invalid name');
            return;
        }
        // Handle form submission
        const formData = new FormData();
        formData.append('name', name);
        if (newImage) formData.append('newImage', newImage);
        if (oldImage) formData.append('oldImage', oldImage);

        // if (newFile) formData.append('file', newFile); // 'files' is the key for your files array

        // formData.append('oldFile', oldFile); // 'files' is the key for your files array


        let newProfile = await fetch(`http://127.0.0.1:5000/users`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${AuthToken}`, // Ensure AuthToken is defined and valid
            },
            body: formData,
        });
        newProfile = await newProfile.json()

        console.log(newProfile)
        // setEditable(false)
        setCurrentUser({ ...newProfile, friends: currentUser.friends })
        navigate('/profile');
    }

    return (
        <div className="container">
            <form className="comment-form" onSubmit={handleSubmit}>
                <div>
                    <div className="form-group name-group">
                        <label htmlFor="name">Name:</label> 
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            className="form-control"
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                </div>
                {src && (
                    <div className="image-container">
                        <img src={src} width="100" className="preview-image" />
                        {(oldImage || newImage) && (
                            <button type="button" onClick={handleRemove} className="remove-button">X</button>
                        )}
                    </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />

                <div className="button-group">
                    <Link to={'/profile'} className="cancel-link">Cancel</Link>
                    <button type="submit" disabled={!name} className="submit-button">Update</button>
                </div>
            </form>
        </div>
    );
};

export default ProfileFormEdit