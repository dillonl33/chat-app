const socket = io();
//const socket = io({transports: ['websocket']});

socket.emit('getUid');

socket.emit('getName');

socket.emit('getEmail');

socket.emit('getLocation');

socket.emit('getGame');

socket.emit('getDc');

socket.on('theName', (theName) => {
    console.log('we got the username as: ' + theName);
    //theName = theName.substr(1);
    //theName = theName.substring(0, theName.length-1);

    document.getElementById('username').innerHTML = "Username: "+theName;

    document.getElementById('personalChat1').href = "../chatGlobal.html?username="+theName+"&room=1";
    document.getElementById('personalChat2').href = "../chatGlobal.html?username="+theName+"&room=2";
    document.getElementById('personalChat3').href = "../chatGlobal.html?username="+theName+"&room=3";
    document.getElementById('globalChat1').href = "../chatGlobal.html?username="+theName+"&room=4";
    document.getElementById('globalChat2').href = "../chatGlobal.html?username="+theName+"&room=5";
    document.getElementById('globalChat3').href = "../chatGlobal.html?username="+theName+"&room=6";
});

socket.on('theUid', (theUid) => {

    document.getElementById('uid').innerHTML = "UID: "+theUid;

});
socket.on('theEmail', (theEmail) => {

    theEmail = theEmail.substr(1);
    theEmail = theEmail.substring(0, theEmail.length-1);
    document.getElementById('email').innerHTML = "Email: "+theEmail;

});
socket.on('theLocation', (theLocation) => {
    theLocation = theLocation.substr(1);
    theLocation = theLocation.substring(0, theLocation.length-1);

    document.getElementById('location').innerHTML = "Location: "+theLocation;

});
socket.on('theDc', (theDc) => {
    theDc = theDc.substr(1);
    theDc = theDc.substring(0, theDc.length-1);
    

    document.getElementById('Discord').innerHTML = "Discord: "+theDc;

});

socket.on('theGame', (theGame) => {
    theGame = theGame.substr(1);
    theGame = theGame.substring(0, theGame.length-1);

    document.getElementById('mainGame').innerHTML = "Main Game: "+theGame;

});
