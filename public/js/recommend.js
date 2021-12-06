//const socket = io();
const socket = io({transports: ['websocket'], upgrade: false});

socket.emit('getRecs');
socket.on('retRecs', (recUsers,len) => {
    // console.log("recUser: " + recUser);
    for (let i = 0; i < 3; i++) {
        document.getElementById('user'+i).innerHTML = recUsers[i].username;
    }
});
