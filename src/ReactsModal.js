// Modal.js
import React, { useEffect } from 'react';
import './InnerReactsModal.css';

function ReactsModal({ isVisible, onClose, children }) {
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
        <div className="modal-overlay1" onClick={onClose}>
            <div className="modal-content1" onClick={e => e.stopPropagation()}>
                <button className="close-button1" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
}

export default ReactsModal;
