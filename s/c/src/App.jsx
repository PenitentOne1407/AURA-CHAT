import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Chat from './components/Chat';
import './App.css';

function App() {
    const [username, setUsername] = useState(null);

    const handleLogin = (name) => {
        setUsername(name);
    };

    return (
        <div className="App">
            {username ? (
                <Chat username={username} />
            ) : (
                <LoginForm onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;
