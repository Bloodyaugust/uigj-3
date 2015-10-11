(function (game) {
  var state = {
    day: 0,
    timeToNextDay: 0
  },
  listeners = [];

  game.getWinState = function () {
    return state.winState;
  };

  game.update = function (data) {
    if (data.type === 'game-start') {
      state.day = 0;
      state.timeToNextDay = data.timeToNextDay;

      console.log('Game start', state);

      game.emit();
    }

    if (data.type === 'game-update') {
      state = data.game;

      game.emit();
    }

    if (data.type === 'game-end') {
      state = data.game;
      console.log('game ended ', state.winState);

      game.emit();
    }
  };

  game.register = function (callback) {
    listeners.push(callback);
  };

  game.emit = function () {
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](state);
    }
  };

  app.dispatcher.register(game.update);
})(window.app.stores.game = {});
