(function (players) {
  var state = {
    players: [],
  },
  listeners = [];

  players.getPlayers = function () {
    return state.players;
  };

  players.update = function (data) {
    if (data.type === 'player-join') {
      state.players = data.players;

      players.emit();
    }

    if (data.type === 'game-update') {
      state.players = data.game.players;

      players.emit();
    }
  };

  players.register = function (callback) {
    listeners.push(callback);
  };

  players.emit = function () {
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](state);
    }
  };

  app.dispatcher.register(players.update);
})(window.app.stores.players = {});
