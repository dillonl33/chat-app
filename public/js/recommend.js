const socket = io();

socket.emit('getRecs');
socket.on('retRecs', (recUsers,len) => {
    // console.log("recUser: " + recUser);
    for (let i = 0; i < 3; i++) {
        document.getElementById('user'+i).innerHTML = recUsers[i].username;
    }
});
