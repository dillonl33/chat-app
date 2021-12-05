const socket = io();


socket.emit('getUid');

socket.emit('getName');

socket.emit('getEmail');

socket.emit('getLocation');

socket.emit('getGame');

socket.emit('getDc');

socket.on('theName', (theName) => {
    console.log('we got the username as: ' + theName);

    document.getElementById('username').innerHTML = "Username: "+theName;

    document.getElementById('personalChat1').href = "../chat.html?username="+theName+"&room=1";
    document.getElementById('personalChat2').href = "../chat.html?username="+theName+"&room=2";
    document.getElementById('personalChat3').href = "../chat.html?username="+theName+"&room=3";
    document.getElementById('globalChat1').href = "../chat.html?username="+theName+"&room=4";
    document.getElementById('globalChat2').href = "../chat.html?username="+theName+"&room=5";
    document.getElementById('globalChat3').href = "../chat.html?username="+theName+"&room=6";
});

socket.on('theUid', (theUid) => {

    document.getElementById('uid').innerHTML = "UID: "+theUid;

});
socket.on('theEmail', (theEmail) => {

    document.getElementById('email').innerHTML = "Email: "+theEmail;

});
socket.on('theLocation', (theLocation) => {

    document.getElementById('location').innerHTML = "Location: "+theLocation;

});
socket.on('theDc', (theDc) => {

    document.getElementById('Discord').innerHTML = "Discord: "+theDc;

});

socket.on('theGame', (theGame) => {

    document.getElementById('mainGame').innerHTML = "Main Game: "+theGame;

});
