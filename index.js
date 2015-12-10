var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var constants = require('./app/constants.js');

var rooms = {};

var testMode = (process.argv[2] === 'test');

if (!testMode) {
  io.on('connection', function(socket){
    socket.on('', handleClientMessage.bind(socket));
    socket.emit('', {type: 'client-connect'});
  });

  http.listen(3000, function(){
    console.log('listening on *:3000');
  });
} else {
  constants['INTRO_LENGTH'] = 1000;
  constants['RECAP_LENGTH'] = 1000;
  constants['DAY_LENGTH'] = 1000;
  (function () {
    var testRoom = createRoom(),
      testRoomName = testRoom.name;

    console.log('Running tests, starting game');

    testRoom.intervalId = setInterval(gameUpdate.bind(testRoom), constants['UPDATE_INTERVAL']);

    console.log('Adding test players');
    for (var i = 0; i < 12; i++) {
      handlePlayerJoin({
        player: {
          name: 'player' + i,
          type: 'civilian',
          state: 'alive',
        },
        room: testRoomName
      });
    }
    if (testRoom.players.length === 12) {
      console.log('SUCCESS: Found correct number of players');
    } else {
      console.log('ERROR: Found incorrect number of players');
    }

    console.log('Starting test game')
    handleGameStart(testRoomName);
    if (testRoom.state === constants['GAME_STATE']['INTRO']) {
      console.log('SUCCESS: Game is in correct state INTRO');
    } else {
      console.log('ERROR: Game is in incorrect state ' + constants['GAME_STATE'][testRoom.state]);
    }

    setTimeout(function () {
      if (testRoom.state === constants['GAME_STATE']['ROUND']) {
        console.log('SUCCESS: Game is in correct state ROUND');
      } else {
        console.log('ERROR: Game is in incorrect state ' + constants['GAME_STATE'][testRoom.state]);
      }
    }, constants['INTRO_LENGTH'] + 500);
    setTimeout(function () {
      if (testRoom.state === constants['GAME_STATE']['RECAP']) {
        console.log('SUCCESS: Game is in correct state RECAP');
      } else {
        console.log('ERROR: Game is in incorrect state ' + constants['GAME_STATE'][testRoom.state]);
      }
    }, constants['INTRO_LENGTH'] + constants['DAY_LENGTH'] + 500);
    setTimeout(function () {
      if (testRoom.state === constants['GAME_STATE']['ROUND']) {
        console.log('SUCCESS: Game is in correct state ROUND');
      } else {
        console.log('ERROR: Game is in incorrect state ' + constants['GAME_STATE'][testRoom.state]);
      }
    }, constants['INTRO_LENGTH'] + constants['DAY_LENGTH'] + constants['RECAP_LENGTH'] + 500);
  })();
}

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
    handlePlayerJoin(data);
  }

  if (data.type === 'game-start') {
    handleGameStart(socket.gameRoom);
  }

  if (data.type === 'player-lynch') {
    data.gameRoom = socket.gameRoom;
    handlePlayerLynch(data);
  }

  if (data.type === 'player-murder') {
    data.gameRoom = socket.gameRoom;
    handlePlayerMurder(data);
  }
}

function handlePlayerJoin(data) {
  rooms[data.room].players.push(data.player);
  rooms[data.room].dirty = true;

  console.log('player joined: ' + data.player.name + ' ' + data.room);
}

function handleGameStart(gameRoom) {
  configurePlayers(gameRoom);
  rooms[gameRoom].dirty = true;
  console.log('Starting new game with players: ');
  for (var i = 0; i < rooms[gameRoom].players.length; i++) {
    console.log(rooms[gameRoom].players[i].name);
  }
}

function handlePlayerLynch(data) {
  var game = rooms[data.gameRoom];

  for (var i = 0; i < game.players.length; i++) {
    if (game.players[i].name === data.name) {
      game.players[i].lynchVotes++;
      game.dirty = true;
      break;
    }
  }
}

function handlePlayerMurder(data) {
  var game = rooms[data.gameRoom];

  for (var i = 0; i < game.players.length; i++) {
    if (game.players[i].name === data.name) {
      game.players[i].murderVotes++;
      game.dirty = true;
      break;
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
    dirty: true,
    timeToNextDay: constants['DAY_LENGTH'],
    timeToEndRecap: constants['RECAP_LENGTH'],
    name: roomName,
    winState: constants['WIN_STATE']['NONE'],
  };

  console.log('room created: ', roomName);
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
    players[i].lynchVotes = 0;
    players[i].murderVotes = 0;
  }

  game.timeStarted = new Date().valueOf();
  game.state = constants['GAME_STATE']['INTRO'];
}

function gameUpdate() {
  var game = this;
  var lynchedPlayerIndex = 0;
  var mostLynchVotes = -1;
  var murderedPlayerIndex = 0;
  var mostMurderVotes = -1;
  var murderers = 0;
  var civilians = 0;

  if (game.state === constants['GAME_STATE']['SETUP']) {

  }

  if (game.state === constants['GAME_STATE']['INTRO']) {
    if (new Date().valueOf() - game.timeStarted >= constants['INTRO_LENGTH']) {
      game.state = constants['GAME_STATE']['ROUND'];
      game.dirty = true;
    }
  }

  if (game.state === constants['GAME_STATE']['ROUND']) {
    game.timeToNextDay -= constants['UPDATE_INTERVAL'];

    if (game.timeToNextDay <= 0) {
      game.timeToNextDay = constants['DAY_LENGTH'];
      game.state = constants['GAME_STATE']['RECAP'];

      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].lynchVotes > mostLynchVotes && game.players[i].state === 'alive') {
          mostLynchVotes = game.players[i].lynchVotes;
          lynchedPlayerIndex = i;
        }
      }
      game.players[lynchedPlayerIndex].state = 'lynched';
      console.log(game.players[lynchedPlayerIndex].name + ' lynched');

      for (i = 0; i < game.players.length; i++) {
        if (game.players[i].murderVotes > mostMurderVotes && game.players[i].state === 'alive') {
          mostMurderVotes = game.players[i].murderVotes;
          murderedPlayerIndex = i;
        }
      }
      game.players[murderedPlayerIndex].state = 'murdered';
      console.log(game.players[murderedPlayerIndex].name + ' murdered');

      for (i = 0; i < game.players.length; i++) {
        console.log(game.players[i].name + ' state: ' + game.players[i].state);
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

      console.log('players: ' + game.players.length);
      console.log('civilians: ' + civilians);
      console.log('Murderers: ' + murderers);
      game.dirty = true;
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
      game.dirty = true;
    }
  }

  if (game.state === constants['GAME_STATE']['END']) {
    clearInterval(game.intervalId);
    game.dirty = true;
  }

  if (!testMode && game.dirty) {
    io.to(game.name).emit('', {
      type: 'game',
      game: game
    });

    game.dirty = false;
  }
}
