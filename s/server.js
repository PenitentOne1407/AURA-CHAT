// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // React app URL
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Store connected users
const users = new Map();

io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // Handle user login
    socket.on('user-login', (username) => {
        users.set(socket.id, username);
        console.log(`👤 ${username} logged in`);

        // Broadcast to all clients
        io.emit('user-joined', {
            username,
            userId: socket.id,
            timestamp: new Date().toLocaleTimeString()
        });

        // Send current user list
        io.emit('user-list', Array.from(users.values()));
    });

    // Handle chat messages
    socket.on('send-message', (data) => {
        console.log(`💬 Message from ${data.username}: ${data.message}`);

        io.emit('receive-message', {
            username: data.username,
            message: data.message,
            userId: socket.id,
            timestamp: new Date().toLocaleTimeString()
        });
    });

    // Handle typing indicator
    socket.on('typing', (username) => {
        socket.broadcast.emit('user-typing', username);
    });

    socket.on('stop-typing', () => {
        socket.broadcast.emit('user-stop-typing');
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const username = users.get(socket.id);
        users.delete(socket.id);
        console.log('❌ User disconnected:', socket.id);

        if (username) {
            io.emit('user-left', {
                username,
                timestamp: new Date().toLocaleTimeString()
            });
            io.emit('user-list', Array.from(users.values()));
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
