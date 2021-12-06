const socket = io();
//const socket = io({transports: ['websocket']});

socket.emit('getRecs');
socket.on('retRecs', (recUsers,len) => {
    // console.log("recUser: " + recUser);
    for (let i = 0; i < len; i++) {
        document.getElementById('user'+i).innerHTML = recUsers[i].username;
    }
});
