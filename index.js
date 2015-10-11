var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var rooms = {};

io.on('connection', function(socket){
  socket.on('', handleClientMessage.bind(socket));
  socket.emit('', {type: 'client-connect'});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function handleClientMessage(data) {
  var socket = this;

  if (data.type === 'create-room') {
    var roomName = createRoom();
    socket.join(roomName);
    socket.gameRoom = roomName;
    socket.emit('', {type: 'new-room', room: roomName});
  }

  if (data.type === 'player-join') {
    socket.join(data.room);
    socket.gameRoom = roomName;
    rooms[data.room].players.push(data.player);
    io.to(data.room).emit('', {
      type: 'player-join',
      players: rooms[data.room].players
    });

    console.log('player joined: ' + data.player.name);
  }

  if (data.type === 'game-start') {
    io.to(socket.gameRoom).emit('', {
      type: 'game-start',
      time: new Date,
      timeToNextDay: 1000 * 30
    });
  }
}

function createRoom() {
  //pulled from http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
  var s = "abcdefghijklmnopqrstuvwxyz";
  var roomName = '';
  var roomFound = false;

  while(!roomFound) {
    roomName = Array(4).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');

    if (!rooms[roomName]) {
      roomFound = true;
    }
  }

  rooms[roomName] = {players: []};
  return roomName;
}
