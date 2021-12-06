//const express = require('express')
//const path = require('path')
//const PORT = process.env.PORT || 3000

// this is backend for the chat. should probably change the name at some point.
// similar to mainGlobal but specifically for user to user. Main difference is that we need to save and load messages. also maybe remove join and leave messages, etc.

// note that "room" means the user you're talking to. can't change this to 'friend' for some reason

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');





const socket = io();

socket.emit('getName');

var username = 'initializedUsername'; // your name
var room = 'initializedroomName'; // friend's name

function getTheName (onDone){
  socket.on('theName', (theName) => {
      //console.log("cookie username: " + document.cookie);
      var current_username = theName;
      var current_room = 'innerInitializedroomName';
      console.log('current_username: ' + current_username);
      //current_room = response.user.username;
      current_room = Qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
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
      }
      onDone(current_username, room);
  });
}

getTheName(function(username, room) {
  //console.log('username/room inside the function: ' + username + '/' + room);
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
    //console.log('why is this undefined...' + room)
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
    const leaveRoom = confirm('Are you sure you want to leave your chat with ' + room + '?');
    if (leaveRoom) {
      window.location = '../homePage.html';
    } else {
    }
  });

});



socket.on('censorIt',  msg => {
  console.log('censorIt' + msg);
  socket.emit('censorIt2', msg);
});

socket.on('censored',  msg => {
  console.log('censored' + msg);
  socket.emit('censored2', msg);
});
