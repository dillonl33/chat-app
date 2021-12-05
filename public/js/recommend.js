const socket = io();
socket.emit('getRecs',0);

socket.on('retRec', (recUser) => {
    document.getElementById('user0').innerHTML = recUser;
});