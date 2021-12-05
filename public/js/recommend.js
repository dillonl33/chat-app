const socket = io();

socket.emit('getRecs');
socket.on('retRecs', (recUsers) => {
    // console.log("recUser: " + recUser);
    for (let i = 0; i < recUsers.length(); i++) {
        document.getElementById('user'+i).innerHTML = recUsers[i].username;
    }
});
