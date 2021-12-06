//const express = require('express')
//const path = require('path')
//const PORT = process.env.PORT || 3000

// this is backend for the chat. should probably change the name at some point.


const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');



// BEGIN CODE TESTING

var {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// END CODE TESTING






const socket = io();




socket.emit('getName2');

var username2 = 'initializedUsername'; // your name
var room2= 'initializedroomName'; // friend's name

function getTheName (onDone){
  socket.on('theName2', (theName) => {
      //console.log("cookie username: " + document.cookie);
      /*var current_username = theName;
      var current_room = 'innerInitializedroomName';
      
      console.log('current_username: ' + current_username);
      //current_room = response.user.username;*/
      //var current_username = theName;
      //var current_room = 'innerInitializedroomName';
      
      var {currUsername, currRoom} = Qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      username2 = currUsername;
      room2 = currRoom;
      console.log("getTheName username: " + username2);
      console.log("getTheName room: " + room2);
      console.log("getTheName BEFORE username: " + username);
      console.log("getTheName BEFORE room: " + room);

      /*

      console.log('current_username: ' + current_username);
      // we want room name to be a combination of friend name and current user name, so they can both be in the same "room". to make it consistent,
      // the 'lesser' name goes first, in alphabetical order
      room = current_room.username;
    console.log('current_username: ' + room);
      if(current_username < room) {
        room = current_username +'_' + room;
      }
      else {
        room = room + '_' + current_username;
      }*/
      onDone(username, room);
  });
}

getTheName(function(username, room) {
  //console.log('username/room inside the function: ' + username + '/' + room);
  // Join chatroom
  socket.emit('joinRoomGlobal', { username, room });






// Join chatroom
//socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers2', ({ room, users }) => {
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
  socket.emit('chatMessage2', msg);

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
    window.location = '../homePage.html';
  } else {
  }
});

});
