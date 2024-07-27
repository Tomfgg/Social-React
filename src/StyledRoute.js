import React from 'react';

const StyledRoute = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <div style={{ backgroundColor: '#7F7F7F', width: '15%', height: 'auto' }}></div>
            <div style={{ flex: 1 }}>
                <div style={{ backgroundColor: '#7F7F7F', width: '100%', height: '30px' }}></div>
                <div style={{ borderRadius: '15px' }}>
                    {children}
                </div>
            </div>
            <div style={{ backgroundColor: '#7F7F7F', width: '15%', height: 'auto' }}></div>
        </div>
    );
};

export default StyledRoute;
