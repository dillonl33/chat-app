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
// therefore, only get username of friend, and use socket to get name of current user.

/*const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});*/

// should these be var instead of const since we want to be able to change the person we are talking to?

/*const { friend } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});*/








const socket = io();

socket.emit('getName');

var username = 'initializedUsername';
var friend = 'initializedFriendName';

function getTheName (onDone){
  socket.on('theName', (theName) => {
      var current_username = theName;
      console.log('current_username: ' + current_username);
      var current_friend = Qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      onDone(current_username, currentFriend);
  });
}
console.log('username/friend before calling function: ' + username + '/' + friend);
// supposedly this can get the username?
getTheName(function(username, friend) {
  console.log('username/friend inside the function: ' + username + '/' + friend);
  // Join chatroom
  socket.emit('joinRoom', { username, friend });

  // Get room and users
  socket.on('roomUsers', ({ friend, users }) => {
    outputRoomName(friend);
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
});

console.log('username after calling function: ' + username);





/*socket.on('theName', (theName) => {
    console.log('we got the username as: ' + theName);

    username = theName;
});*/



/*
// Join chatroom
socket.emit('joinRoom', { username, friend });

// Get room and users
socket.on('roomUsers', ({ friend, users }) => {
  outputRoomName(friend);
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
function outputRoomName(friend) {
  roomName.innerText = friend;
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
  const leaveRoom = confirm('Are you sure you want to leave your chat with' + friend + '?');
  if (leaveRoom) {
    window.location = '../homePage.html';
  } else {
  }
});
