const socket = io();

socket.emit('getName');

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