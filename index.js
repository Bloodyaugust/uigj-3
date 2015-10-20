var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var rooms = {};

var constants = {
  'GAME_STATE': {
    'SETUP': 0,
    'INTRO': 1,
    'ROUND': 2,
    'RECAP': 3,
    'END': 4,
  },
  'WIN_STATE': {
    'NONE': 0,
    'CIVILIANS': 1,
    'MURDERERS': 2,
  },
  'INTRO_LENGTH': 15 * 1000,
  'DAY_LENGTH': 30 * 1000,
  'UPDATE_INTERVAL': 16,
};

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
    var room = createRoom();
    socket.join(room.name);
    socket.gameRoom = room.name;
    rooms[socket.gameRoom].intervalId = setInterval(gameUpdate.bind(rooms[socket.gameRoom]), constants['UPDATE_INTERVAL']);
  }

  if (data.type === 'player-join') {
    socket.join(data.room);
    socket.gameRoom = data.room;
    rooms[data.room].players.push(data.player);

    console.log('player joined: ' + data.player.name + ' ' + data.room);
  }

  if (data.type === 'game-start') {
    configurePlayers(socket.gameRoom);
    console.log('Starting new game with players: ');
    for (i = 0; i < rooms[socket.gameRoom].players.length; i++) {
      console.log(rooms[socket.gameRoom].players[i].name);
    }
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
      state: constants['GAME_STATE']['SETUP'],
      day: 1,
      timeToNextDay: constants['DAY_LENGTH'],
      name: roomName,
      winState: 'none'
    };
  return rooms[roomName];
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

  for (var i = 0; i < players.length; i++) {
    players.lynchVotes = 0;
    players.murderVotes = 0;
  }

  game.timeStarted = new Date().valueOf();
  game.state = constants['GAME_STATE']['INTRO'];
}

function gameUpdate() {
  var game = this;
  var lynchedPlayerIndex = 0;
  var mostLynchVotes = 0;
  var murderedPlayerIndex = 0;
  var mostMurderVotes = 0;
  var murderers = 0;
  var civilians = 0;

  if (game.state === constants['GAME_STATE']['SETUP']) {

  }

  if (game.state === constants['GAME_STATE']['INTRO']) {
    if (new Date().valueOf() - game.timeStarted >= constants['INTRO_LENGTH']) {
      game.state = constants['GAME_STATE']['ROUND'];
    }
  }

  if (game.state === constants['GAME_STATE']['ROUND']) {
    game.timeToNextDay -= constants['UPDATE_INTERVAL'];

    if (game.timeToNextDay <= 0) {
      game.timeToNextDay = constants['DAY_LENGTH'];
      game.state = constants['GAME_STATE']['RECAP'];

      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].lynchVotes > mostLynchVotes) {
          mostLynchVotes = game.players[i].lynchVotes;
          lynchedPlayerIndex = i;
        }
        if (game.players[i].murderVotes > mostMurderVotes) {
          mostMurderVotes = game.players[i].murderVotes;
          murderedPlayerIndex = i;
        }

        if (game.players[i].type === 'murderer' && game.players[i].state === 'alive') {
          murderers++;
        }
        if (game.players[i].type === 'civilian' && game.players[i].state === 'alive') {
          civilians++;
        }
      }

      if (murderers === 0) {
        console.log('setting win state civilians');
        game.winState = constants['WIN_STATE']['CIVILIANS'];
      }
      if (civilians <= murderers) {
        console.log('setting win state murderers');
        game.winState = constants['WIN_STATE']['MURDERERS'];
      }

      console.log('civilians: ' + civilians);
      console.log('Murderers: ' + murderers);

      game.players[lynchedPlayerIndex].state = 'lynched';
      console.log('Player lynched ' + game.players[lynchedPlayerIndex].name);
      game.players[murderedPlayerIndex].state = 'murdered';
      console.log('Player murdered ' + game.players[murderedPlayerIndex].name);
    }
  }

  if (game.state === constants['GAME_STATE']['RECAP']) {
    game.timeToEndRecap -= constants['UPDATE_INTERVAL'];

    if (game.timeToEndRecap <= 0) {
      game.timeToEndRecap = constants['RECAP_LENGTH'];

      if (game.winState === constants['WIN_STATE']['NONE']) {
        game.state = constants['GAME_STATE']['ROUND'];

        for (i = 0; i < game.players.length; i++) {
          game.players.lynchVotes = 0;
          game.players.murderVotes = 0;
        }
      } else {
        game.state = constants['GAME_STATE']['END'];
      }
    }
  }

  if (game.state === constants['GAME_STATE']['END']) {

  }

  io.to(game.name).emit('', {
    type: 'game',
    game: game
  });
}
