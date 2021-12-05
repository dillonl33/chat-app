const path = require('path');
const http = require('http');
var session = require('express-session');
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

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// global variable as username, probably bad
var ourUsername = 'uninitializedUsername';

app.get('/', function(request, response) {
	//response.sendFile(path.join(__dirname + '/login.html'));
  response.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/auth2', function(request, response) {
	console.log('in auth2 function, attempting to log in');
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
        ourUsername = username;
				response.redirect('/home?user=' +  username); // NOTE: adding user query here IS NOT IMPLEMENTED, couldn't figure it out. that's why we use socket.io to get the username in the index2 itself.
        //response.render('./public/index2'/*,{user:request.session.username}*/)
        //response.sendFile(path.join(__dirname + '/public/index2.html'));2
			} else {
        request.session.loggedin = false;
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
    request.session.loggedin = false;
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		//response.send('Welcome back, ' + request.session.username + '!');
    response.sendFile(path.join(__dirname + '/public/homePage.html'));
	} else {
		response.send('Please login to view this page!');
    response.end();
	}
	//response.end();
});


// END CODE FROM LOGIN







const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// BEGIN CODE FROM RAI

console.log(`Connecting to database`)
const { Client } = require('pg');
const e = require('express');

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

  // just for getting names since idk how to do it with await etc, taking advantage of sockets for another thing.
  socket.on('getName', () => {
    socket.emit('theName', ourUsername);
  })

  // profile editing
app.post('/update', function(req, res) {  
  if (!req.body) return res.sendStatus(400);

  console.log('firstname: ' + req.body.firstname);
  console.log('lastname: ' + req.body.lastname);
  console.log('Email: ' + req.body.email);
  console.log('PhoneNumber: ' + req.body.mobile_number);
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var phone = req.body.mobile_number;
  var location = req.body.location;
  var game = req.body.main_game;
  var day = req.body.day;
  var month = req.body.month;
  var year = req.body.year;
  var discord = req.body.discord;
  
  let update_query = "UPDATE users SET firstname = '" + firstname + "', lastname = '" + lastname + "', email = '" + email + "', phone = '" + phone + "', location = '" + location + "', game = '" + game + "', day = '" + day
                    + "', month = '" + month + "', year = '" + year + "', discord = '" + discord + "' WHERE username = '" + ourUsername + "'; ";
    client.query(update_query, (err) => {
          if (err) throw err;
          res.redirect('/home?user=' +  ourUsername);
          
      });

});

app.get('/update', function(req, res) {  
  if (!req.body) return res.sendStatus(400);

  console.log('firstname: ' + req.body.firstname);
  console.log('lastname: ' + req.body.lastname);
  console.log('Email: ' + req.body.email);
  console.log('PhoneNumber: ' + req.body.mobile_number);
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var phone = req.body.mobile_number;
  var location = req.body.location;
  var game = req.body.main_game;
  var day = req.body.day;
  var month = req.body.month;
  var year = req.body.year;
  var discord = req.body.discord;
  
  let update_query = "UPDATE users SET firstname = '" + firstname + "', lastname = '" + lastname + "', email = '" + email + "', phone = '" + phone + "', location = '" + location + "', game = '" + game + "', day = '" + day
                  + "', month = '" + month + "', year = '" + year + "', discord = '" + discord + "' WHERE username = '" + ourUsername + "'; ";
  console.log(update_query);

  client.query(update_query, (err) => {
        if (err) throw err;
        res.redirect('/home?user=' +  ourUsername);
  });

});
// end

  socket.on('joinRoom', ({ username, room }) => {
    
    var uid = '';
    client.query('SELECT uid from users where username = \'' + username + '\';' , (err, ret) => {
      uid = JSON.stringify(ret.rows[0].uid);
      console.log('UID: ' + uid);
    });


    const user = userJoin(socket.id, username, room, uid);
    
    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Load previous messages. this should only find history for user to user, but this is not specified here, as I don't know how to send that. maybe i could add a boolean variable if necessary.
      var temp;
      var temp2;
      var temp3 = [];
      var firstPart = user.room.substring(0,user.room.indexOf('_'));
      var secondPart = user.room.substring(user.room.indexOf('_')+1);

      var user_uid = '0';

      client.query('SELECT senderid, message, time from chats where (senderid = (select uid from users where username = \'' + firstPart + '\') and receiverid = (select uid from users where username = \'' + secondPart + '\'))  OR (senderid = (select uid from users where username = \'' + secondPart + '\') and receiverid = (select uid from users where username = \'' + firstPart + '\')  ) ORDER BY time ASC LIMIT 10 ;', (err, ret) => {
      //client.query('SELECT senderid, message, time FROM chats WHERE senderid = (select uid from users where username = \'' + username + '\') AND receiverid = (select uid from users where username = \'' + room + '\'));', (err, ret) => {
        if (err) throw err;
        for (let row of ret.rows) {
          //temp = JSON.stringify(row);
          //temp2 = temp.split(',');
          var name = 'initializedName';
          var msg = 'initializedMsg';
          msg = row.message;
          var time = 'initializedTime';
          console.log('raw time: ' + row.time);
          time = JSON.stringify(row.time);
          console.log('stringified time: ' + time);
          time = time.substring(time.indexOf('T')+1,  time.indexOf('.'));
          console.log('formatted time: ' + time);
          if(row.senderid == uid) { // this chat is from user to friend
            console.log("this does happen");
            name = username;
          } else { // friend to user
            console.log("hopefully  this isn't all that happens");
            console.log("row.senderid: " + row.senderid + ", our uid: " + uid);
            if(firstPart == username) {
              name = secondPart;
            } else {
              name = firstPart;
            }
          }
          //temp3[index] =  i.substring(i.indexOf(":")+2, i.lastIndexOf("\""));
          //index++;

          socket.emit('message', formatMessage2(name, msg , time));
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
    // chatid, senderid, receiverid, message, time
    var senderid = '';
    var receiverid = '';
    if(user.username == user.room.substring(0,user.room.indexOf('_'))) { // username is first part
      senderid = user.room.substring(0,user.room.indexOf('_'));
      receiverid = user.room.substring(user.room.indexOf('_')+1);
    } else {
      receiverid = user.room.substring(0,user.room.indexOf('_'));
      senderid = user.room.substring(user.room.indexOf('_')+1);
    }
    client.query('INSERT INTO chats values (default, (select uid from users where username = \'' + senderid + '\'), (select uid from users where username = \'' + receiverid + '\'), \'' + msg + '\', CURRENT_TIMESTAMP);', (err, ret) => {
      //client.query('SELECT senderid, message, time FROM chats WHERE senderid = (select uid from users where username = \'' + username + '\') AND receiverid = (select uid from users where username = \'' + room + '\'));', (err, ret) => {
        //if (err) throw err;
        // perhaps if it's not thrown it will be alright?
        if(err) {
          console.log(err);
        }
        /*for (let row of ret.rows) {
          temp = JSON.stringify(row);
          temp2 = temp.split(',');
          var index = 0;
          for(let i of temp2 ) {
            temp3[index] =  i.substring(i.indexOf(":")+2, i.lastIndexOf("\""));
            index++;
          }
          socket.emit('message', formatMessage2(temp3[0], temp3[1], temp3[2]));
        }*/

      });


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
