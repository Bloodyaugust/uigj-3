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
  var socket = this,
    game;

  if (data.type === 'create-room') {
    var roomName = createRoom();
    socket.join(roomName);
    socket.gameRoom = roomName;
    socket.emit('', {type: 'new-room', room: roomName});
  }

  if (data.type === 'player-join') {
    socket.join(data.room);
    socket.gameRoom = data.room;
    rooms[data.room].players.push(data.player);
    io.to(data.room).emit('', {
      type: 'player-join',
      players: rooms[data.room].players
    });

    console.log('player joined: ' + data.player.name + ' ' + data.room);
  }

  if (data.type === 'game-start') {
    configurePlayers(socket.gameRoom);
    console.log('Starting new game with players: ');
    for (i = 0; i < rooms[socket.gameRoom].players.length; i++) {
      console.log(rooms[socket.gameRoom].players[i].name);
    }
    io.to(socket.gameRoom).emit('', {
      type: 'game-start',
      game: rooms[socket.gameRoom]
    });
    rooms[socket.gameRoom].intervalId = setInterval(gameUpdate.bind(rooms[socket.gameRoom]), 16);
  }

  if (data.type === 'player-lynch') {
    game = rooms[socket.gameRoom];

    for (var i = 0; i < game.players.length; i++) {
      if (game.players[i].name === data.name) {
        game.players[i].lynchVotes++;
        break;
      }
    }
  }

  if (data.type === 'player-murder') {
    game = rooms[socket.gameRoom];

    for (var i = 0; i < game.players.length; i++) {
      if (game.players[i].name === data.name) {
        game.players[i].murderVotes++;
        break;
      }
    }
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

  rooms[roomName] = {
      players: [],
      day: 0,
      timeStarted: new Date().valueOf(),
      timeToNextDay: 1000 * 30,
      lastDay: new Date().valueOf(),
      name: roomName,
      winState: 'none'
    };
  return roomName;
}

function configurePlayers(roomName) {
  var game = rooms[roomName];
  var players = game.players;
  var numMurderers = (players / 4 >= 1 ? Math.floor(players / 4) : 1);
  var numMurderersAssigned = 0;
  var possibleMurderer = 0;

  while (numMurderersAssigned < numMurderers) {
    possibleMurderer = Math.floor(Math.random() * players.length);

    if (players[possibleMurderer].type !== 'murderer') {
      players[possibleMurderer].type = 'murderer';
      numMurderersAssigned++;
    }
  }

  game.timeToNextDay = 1000 * 10;
  game.timeStarted = new Date().valueOf();
  game.lastDay = new Date().valueOf();

  io.to(roomName).emit('', {
    type: 'players-configured',
    players: players,
  });
}

function gameUpdate() {
  var game = this;
  var lynchedPlayerIndex = 0;
  var mostLynchVotes = 0;
  var murderedPlayerIndex = 0;
  var mostMurderVotes = 0;
  var murderers = 0;
  var civilians = 0;

  game.timeToNextDay = (1000 * 30) - (new Date().valueOf() - game.lastDay);

  if (new Date().valueOf() - game.lastDay >= 1000 * 30) {
    game.day++;
    game.lastDay = new Date().valueOf();
    game.timeToNextDay = 0;
    console.log('New day: ' + game.name + ' ' + game.day);

    if (game.winState === 'none') {
      if (game.day !== 1) {
        console.log('running kill logic');
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].lynchVotes > mostLynchVotes) {
            mostLynchVotes = game.players[i].lynchVotes;
            lynchedPlayerIndex = i;
            console.log('Player lynched ' + game.players[i].name);
          }
          if (game.players[i].murderVotes > mostMurderVotes) {
            mostMurderVotes = game.players[i].murderVotes;
            murderedPlayerIndex = i;
            console.log('Player murdered ' + game.players[i].name);
          }
        }

        game.players[lynchedPlayerIndex].state = 'lynched';
        game.players[murderedPlayerIndex].state = 'murdered';
      }

      for (i = 0; i < game.players.length; i++) {
        if (game.players[i].type === 'murderer' && game.players[i].state === 'alive') {
          murderers++;
          console.log('Murderers: ' + murderers);
        }
        if (game.players[i].type === 'civilian' && game.players[i].state === 'alive') {
          civilians++;
          console.log('civilians: ' + civilians);
        }

        game.players[i].lynchVotes = 0;
        game.players[i].murderVotes = 0;
      }
    } else {

  }

  if (game.winState === 'none' && game.day > 0) {
    if (murderers === 0 && game.day > 1) {
      console.log('setting win state civilians');
      game.winState = 'civilians';
    }
    if (civilians === 1 && murderers >= 1 && game.day > 1) {
      console.log('setting win state murderers');
      game.winState = 'murderers';
    }

    if (game.winState === 'none') {
      io.to(game.name).emit('', {
        type: 'game-update',
        game: game
      });
    } else {
        clearInterval(game.intervalId);
        io.to(game.name).emit('', {
          type: 'game-end',
          game: game
        });

        rooms[game.name] = null;
      }
    }
  }
}
