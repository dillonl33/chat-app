const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
//const formatMessage2 = require('./utils/messages');
const {formatMessage, formatMessage2} = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const loginStuff = require('./public/js/login');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// BEGIN CODE FROM RAI

console.log(`Connecting to database`)
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
		rejectUnauthorized: false
    }
});

client.connect();


// END CODE FROM RAI



const botName = 'ChatCord Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Load previous messages
      var temp;
      var temp2;
      var temp3 = [];
      client.query('SELECT username, message, timestamp FROM chats;', (err, ret) => {
        if (err) throw err;
        for (let row of ret.rows) {
          temp = JSON.stringify(row);
          temp2 = temp.split(',');
          var index = 0;
          for(let i of temp2 ) {
            temp3[index] =  i.substring(i.indexOf(":")+2, i.lastIndexOf("\""));
            index++;
          }
          socket.emit('message', formatMessage2(temp3[0], temp3[1], temp3[2]));
        }

      });

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
