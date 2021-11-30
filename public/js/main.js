const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});


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






const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
