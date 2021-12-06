// this is just to show how you can get info from the server thru sockets.
// we want to put the homepage after logging in. similar code to this should go in the homepage javascript to get the username from logging in.


//const socket = io();
const socket = io({transports: ['websocket'], upgrade: false});

socket.emit('getName');

socket.on('theName', (theName) => {
    console.log('we got the username as: ' + theName);

    document.getElementById('theName').innerHTML = theName;
});

