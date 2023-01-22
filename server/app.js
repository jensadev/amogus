const app = require('express')();

const http = require('http').Server(app);

const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:8000'],
    },
});

io.on('connection', (socket) => {
    const room = socket.handshake.query.room;
    console.log(room)
    socket.join(room);
    io.to(room).emit('playerJoined');

    console.log('a user connected');
    socket.on('move', (data) => {
        console.log(data);
        socket.broadcast.to(room).emit('move', data.x, data.y);
    });
    socket.on('moveEnd', () => {
        console.log('moveEnd');
        socket.broadcast.to(room).emit('moveEnd');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});