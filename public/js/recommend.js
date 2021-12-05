const socket = io();

for (let i = 0; i < 10; i++) {
    socket.emit('getRecs',i);
    socket.on('retRecs', (recUser) => {
        console.log("recUser: " + recUser);
        document.getElementById('user'+i).innerHTML = recUser;
    });
}