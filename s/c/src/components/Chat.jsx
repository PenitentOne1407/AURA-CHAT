import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const socket = io('http://localhost:5000');

function Chat({ username }) {
    const [messages, setMessages] = useState([]);
    const [userList, setUserList] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);

    useEffect(() => {
        // Emit login event
        socket.emit('user-login', username);

        // Listen for messages
        socket.on('receive-message', (data) => {
            setMessages((prev) => [...prev, { ...data, type: 'chat' }]);
        });

        // Listen for user joined
        socket.on('user-joined', (data) => {
            setMessages((prev) => [
                ...prev,
                { type: 'system', text: `${data.username} joined the chat` }
            ]);
        });

        // Listen for user left
        socket.on('user-left', (data) => {
            setMessages((prev) => [
                ...prev,
                { type: 'system', text: `${data.username} left the chat` }
            ]);
        });

        // Listen for user list
        socket.on('user-list', (users) => {
            setUserList(users);
        });

        // Cleanup on unmount
        return () => {
            socket.off('receive-message');
            socket.off('user-joined');
            socket.off('user-left');
            socket.off('user-list');
        };
    }, [username]);

    const handleSendMessage = (message) => {
        socket.emit('send-message', { username, message });
    };

    return (
        <>
            <div className="pattern-bg"></div>

            <header>
                <div className="logo">Aura - Realtime User Chats</div>
                <button className="online-btn" onClick={() => setShowUserModal(true)}>
                    Users <span id="userCount">{userList.length}</span>
                </button>
            </header>

            <div id="mainArea">
                <MessageList messages={messages} currentUser={{ name: username, id: socket.id }} />
                <MessageInput
                    onSendMessage={handleSendMessage}
                    userList={userList}
                    currentUsername={username}
                />
            </div>

            {/* User Modal */}
            {showUserModal && (
                <div className="modal" onClick={() => setShowUserModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={() => setShowUserModal(false)}>&times;</span>
                        <h3>Users Online</h3>
                        <div className="user-modal-list">
                            {userList.map((user, index) => (
                                <div key={index} className="user-item">{user}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <footer className="footer">
                <div className="footer-main">
                    <span>&copy; 2025 Aura Realtime User Chats.</span>
                    <span>Modern, secure. Connecting people, empowering ideas.</span>
                </div>
                <div className="footer-credits">
                    <span>Crafted by <b>Pradhyumn Maurya</b> &amp; <b>Tamanna Chetry</b>. Powered by open-source.</span>
                </div>
            </footer>
        </>
    );
}

export default Chat;
