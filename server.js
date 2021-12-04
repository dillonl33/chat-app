const path = require('path');
const http = require('http');
var session2 = require('express-session');
var bodyParser = require('body-parser');
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

//const app = express();
var app = express();

// START CODE FROM LOGIN

app.use(session2({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	//response.sendFile(path.join(__dirname + '/login.html'));
  response.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/auth2', function(request, response) {
	console.log('can we see this?');
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
    //client.query('SELECT * FROM user_passwords;', function(error, results, fields) {
		client.query('SELECT * FROM user_passwords WHERE username = \''+username+'\' AND password = \'' + password + '\';', (err, ret) =>  {
      if (err) throw err;
      console.log('username: ' + username + ', password: ' + password + ', results: ' + ret.rows.length);

			if (ret != null && ret.rows.length > 0) {
        console.log('pizza time');
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session2.loggedin) {
		response.send('Welcome back, ' + request.session2.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

// END CODE FROM LOGIN







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
