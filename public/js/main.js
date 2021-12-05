//const express = require('express')
//const path = require('path')
//const PORT = process.env.PORT || 3000

// this is backend for the chat. should probably change the name at some point.
// similar to mainGlobal but specifically for user to user. Main difference is that we need to save and load messages. also maybe remove join and leave messages, etc.

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');



// Get username and room from URL
// UPDATE: we want to get username of person and the person they are talking to.
// therefore, only get username of room, and use socket to get name of current user.

/*const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});*/

// should these be var instead of const since we want to be able to change the person we are talking to?

/*const { room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});*/


/*const {const_current_room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});*/





const socket = io();

socket.emit('getName');

var username = 'initializedUsername';
var room = 'initializedroomName';

function getTheName (onDone){
  socket.on('theName', (theName) => {
      var current_username = theName;
      var current_room = 'innerInitializedroomName';
      console.log('current_username: ' + current_username);
      current_room = Qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      room = current_room.username;
      //console.log('1: ' + current_room.username);
      //console.log('2: ' + room.substring(1, room.length-1))
      //console.log('current_freind: ' + current_room);
      console.log('room:' + room);
      onDone(current_username, room);
  });
}
console.log('username/room before calling function: ' + username + '/' + room);
// supposedly this can get the username?
getTheName(function(username, room) {
  console.log('username/room inside the function: ' + username + '/' + room);
  // Join chatroom
  console.log('?' + room);
  socket.emit('joinRoom', { username, room });
  console.log(room);

  // Get room and users
  socket.on('roomUsers', ({ room, users }) => {
    console.log(room);
    outputRoomName(room);
    outputUsers(users);
  });

  // Message from server
  socket.on('message', (message) => {
    console.log(room);
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
    console.log('why is this undefined...' + room)
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
    const leaveRoom = confirm('Are you sure you want to leave your chat with' + room + '?');
    if (leaveRoom) {
      window.location = '../homePage.html';
    } else {
    }
  });

});

console.log('username after calling function: ' + username);





/*socket.on('theName', (theName) => {
    console.log('we got the username as: ' + theName);

    username = theName;
});*/



/*
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
*/
// Output message to DOM
/*
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
  const leaveRoom = confirm('Are you sure you want to leave your chat with' + room + '?');
  if (leaveRoom) {
    window.location = '../homePage.html';
  } else {
  }
});
*/