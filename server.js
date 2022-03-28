const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');


const io = socket(server);

const rooms = {}; // Keep track of the current rooms we have. Since this application is small, in-memory is fine.

io.on('connection', (socket) => {
    socket.on("room_join", roomId => {
        if(rooms[roomId]) { // If the room is already present, add the socket to the room.
            rooms[roomId].push(socket.id);
        } else { // If the room isn't present, create it.
            rooms[roomId] = [socket.id]
        }
    })

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    })

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    })

    socket.on("ice-candidate", payload => {
        io.to(payload.target).emit("ice-candidate", payload);
    })
});

server.listen(8080, () => {
    console.log("Server started on port 8080.");
})
