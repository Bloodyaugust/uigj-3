(function (game) {
  var state = {
    day: 0,
    timeToNextDay: 0
  },
  listeners = [];

  game.update = function (data) {
    if (data.type === 'game-start') {
      state.day = 0;
      state.timeToNextDay = data.timeToNextDay;

      players.emit();
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
