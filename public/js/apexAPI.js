function getRank(username) {
    const socket = io();

    socket.emit('getRank');
    socket.on('retRank', (level) => {
        console.log("User Level: " + level);
        document.getElementById('rank') = 'Level: '+level;
    });

}