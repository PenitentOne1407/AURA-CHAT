import React, { useState } from 'react';

function LoginForm({ onLogin }) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username.trim());
        } else {
            alert('Please enter your name.');
        }
    };

    return (
        <div className="overlay">
            <div className="login-card">
                <h2 style={{ color: '#44caff', marginBottom: '20px' }}>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={20}
                        autoFocus
                    />
                    <button type="submit">Join Chat</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
