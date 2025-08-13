// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let locations = {}; // { socket.id: { lat, lng, name } }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('locationUpdate', (data) => {
    console.log('Location update from', socket.id, data); // ✅ Log location
    locations[socket.id] = data;
    io.emit('locations', locations);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete locations[socket.id];
    io.emit('locations', locations);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
