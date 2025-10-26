import React, { useEffect, useRef } from 'react';

function MessageList({ messages, currentUser }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to highlight mentions
    const highlightMentions = (text) => {
        return text.replace(/@(\w+)/g, '<span class="mention-highlight">@$1</span>');
    };

    return (
        <div className="messages">
            {messages.map((msg, index) => {
                if (msg.type === 'system') {
                    return (
                        <div key={index} style={{
                            textAlign: 'center',
                            padding: '8px',
                            color: '#44caff',
                            fontSize: '0.95em',
                            fontStyle: 'italic',
                            margin: '10px 0'
                        }}>
                            {msg.text}
                        </div>
                    );
                }

                const isOwnMessage = msg.username === currentUser.name;

                return (
                    <div
                        key={index}
                        className={`message ${isOwnMessage ? 'self' : 'other'}`}
                        dangerouslySetInnerHTML={{
                            __html: `<span class="sender">${msg.username}:</span> ${highlightMentions(msg.message)}`
                        }}
                    />
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageList;
