const socket = io();

socket.emit('getRecs',0);
socket.on('retRecs', (recUser) => {
    console.log("recUser: " + recUser);
    document.getElementById('user0').innerHTML = recUser;
});

socket.emit('getRecs',1);
socket.on('retRecs', (recUser) => {
    console.log("recUser: " + recUser);
    document.getElementById('user1').innerHTML = recUser;
});

socket.emit('getRecs',2);
socket.on('retRecs', (recUser) => {
    console.log("recUser: " + recUser);
    document.getElementById('user2').innerHTML = recUser;
});

socket.emit('getRecs',3);
socket.on('retRecs', (recUser) => {
    console.log("recUser: " + recUser);
    document.getElementById('user3').innerHTML = recUser;
});

socket.emit('getRecs',4);
socket.on('retRecs', (recUser) => {
    console.log("recUser: " + recUser);
    document.getElementById('user4').innerHTML = recUser;
});

socket.emit('getRecs',5);
socket.on('retRecs', (recUser) => {
    console.log("recUser: " + recUser);
    document.getElementById('user5').innerHTML = recUser;
});

socket.emit('getRecs',6);
socket.on('retRecs', (recUser) => {
    console.log("recUser: " + recUser);
    document.getElementById('user6').innerHTML = recUser;
});

socket.emit('getRecs',7);
socket.on('retRecs', (recUser) => {
    console.log("recUser: " + recUser);
    document.getElementById('user7').innerHTML = recUser;
});

socket.emit('getRecs',8);
socket.on('retRecs', (recUser) => {
    console.log("recUser: " + recUser);
    document.getElementById('user8').innerHTML = recUser;
});

socket.emit('getRecs',9);
socket.on('retRecs', (recUser) => {
    console.log("recUser: " + recUser);
    document.getElementById('user9').innerHTML = recUser;
});