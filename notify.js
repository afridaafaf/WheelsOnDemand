import React, { useState } from 'react';

const Notify = () => {
    const [message, setMessage] = useState('');
    const [notification, setNotification] = useState('');

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendNotification = () => {
        // Here you would typically send the notification to the server
        // For now, we'll just set the notification state
        setNotification(message);
        setMessage('');
    };

    return (
        <div>
            <h1>Send Notification</h1>
            <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Enter your message"
            />
            <button onClick={handleSendNotification}>Send</button>
            {notification && (
                <div className="notification">
                    <p>{notification}</p>
                </div>
            )}
        </div>
    );
};

export default Notify;