import React, { useState, useRef, useEffect } from 'react';

function MessageInput({ onSendMessage, userList, currentUsername }) {
    const [message, setMessage] = useState('');
    const [showMentionDropdown, setShowMentionDropdown] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessage(value);

        // Check for @ mention
        const atPos = value.lastIndexOf('@');
        if (atPos !== -1) {
            const query = value.slice(atPos + 1).toLowerCase();
            const filtered = userList.filter(
                (u) => u !== currentUsername && u.toLowerCase().startsWith(query)
            );
            if (filtered.length > 0) {
                setFilteredUsers(filtered);
                setShowMentionDropdown(true);
                setSelectedIndex(0);
            } else {
                setShowMentionDropdown(false);
            }
        } else {
            setShowMentionDropdown(false);
        }
    };

    const selectMention = (name) => {
        const atPos = message.lastIndexOf('@');
        if (atPos !== -1) {
            setMessage(message.slice(0, atPos + 1) + name + ' ');
        }
        setShowMentionDropdown(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (showMentionDropdown) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredUsers.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                selectMention(filteredUsers[selectedIndex]);
                return;
            } else if (e.key === 'Escape') {
                setShowMentionDropdown(false);
            }
        } else if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
            setShowMentionDropdown(false);
        }
    };

    return (
        <div className="input-row">
            <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
            />

            {showMentionDropdown && (
                <div className="mention-dropdown">
                    {filteredUsers.map((user, index) => (
                        <div
                            key={index}
                            className={`dropdown-item ${index === selectedIndex ? 'active' : ''}`}
                            onClick={() => selectMention(user)}
                        >
                            {user}
                        </div>
                    ))}
                </div>
            )}

            <button onClick={handleSubmit}>Send</button>
        </div>
    );
}

export default MessageInput;
