const express = require('express');
const http = require('http');
const socket = require('socket.io');

const PORT = 3000;
const APPLICATION = 'chat';

const app = express();
const server = http.createServer(app);
app.use(express.static(`public/${APPLICATION}`));
const io = socket(server);


let sockets = [];
let users = [];
let usercount = 0;

io.on('connect', (socket) => {

    socket.emit('message', `Welcome to the ${APPLICATION} website!`);

    ++usercount;
    socket.emit('user-new', usercount);
    socket.on('username', (username) => {
        sockets.push(socket);
        users.push(username);
        console.log(`${username} connected`);
        io.sockets.emit('user-connect', username);
    })

    socket.on('disconnect', () => {
        let i = sockets.indexOf(socket);
        sockets.splice(i, 1);
        let username = users.splice(i, 1)[0];
        console.log(`${username} disconnected`);
        io.sockets.emit('user-disconnect', username);
    });

    socket.on('drawing', (line) => {
        io.sockets.emit('drawing', line);
    });
    socket.on('chat', (message) => {
        console.log(`${message.user}: ${message.msg}`);
        io.sockets.emit('chat', message);
    });
})

server.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));