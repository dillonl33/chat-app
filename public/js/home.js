const socket = io();

socket.emit('getName');

socket.on('theName', (theName) => {
    console.log('we got the username as: ' + theName);

    document.getElementById('username').innerHTML = "Username: "+theName;
});