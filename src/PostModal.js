// Modal.js
import React, { useEffect } from 'react';
import './PostModal.css';

function PostModal({ isVisible, onClose, children }) {
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="n-modal-overlay" onClick={onClose}>
            <div className="n-modal-content" onClick={e => e.stopPropagation()}>
                <button className="n-close-button" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
}

export default PostModal;
