const socket = io();

socket.emit('getRecs',0);

socket.on('retRecs', (recUser) => {
    document.getElementById('user0').innerHTML = recUser;
});