const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

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

async function email_api_req(req_email){
	var temp;
	
	var mail_link = "https://gamers-matchmaking.herokuapp.com/email?email=" + req_email + 
	"&user-id=raistlynniyn&api-key=lOjqSRTgCzTKJukkST33lnAiOSSuzLhMAXBT33Vu45jdWWIL";
	
	await fetch(mail_link)
	.then(async function(response) {
		temp = await response.json();
	});
	
	function wait_on(variable){
		if(variable == "")
			setTimeout(() => {wait_on(variable);}, 300);
	}
	wait_on(temp);
	
	return temp;
}


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/help', (req, res) => {
  res.send('Hello World help!')
})

app.get('/username', (req, res) => {
	var req_name = req.query.name;
	var temp;
	client.query('SELECT count(*) FROM user_password WHERE username = \''+ req_name +'\';', (err, ret) => {
		if (err) throw err;
		for (let row of ret.rows) {
			temp = JSON.stringify(row);
		}
		console.log(temp);
		res.send(temp);
	});
})

app.get('/email', (req, res) => {
	var req_name = req.query.email;
	var temp;
	console.log(req_name);
	client.query('SELECT count(*) FROM user_profile WHERE email = \''+ req_name +'\';', (err, ret) => {
		if (err) throw err;
		for (let row of ret.rows) {
			temp = JSON.stringify(row);
		}
		console.log(temp);
		res.send(temp);
	});
})

app.get('/email-api', (req, res) => {
	var req_email = req.query.email;
	var temp = "";
	
	temp = email_api_req(req_email);
	
	function wait_on(variable){
		if(variable == "")
			setTimeout(() => {wait_on(variable);}, 300);
	}
	wait_on(temp);
	
	res.send(temp);
})

// END CODE FROM RAI



const botName = 'ChatCord Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

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
