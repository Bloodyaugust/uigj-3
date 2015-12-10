(function (game) {
  var state = {},
  listeners = [];

  game.update = function (data) {
    if (data.type === 'game') {
      state = data.game;
      game.emit();
      console.log('Game update ', data);
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

  game.getState = function () {
    return state;
  };

  app.dispatcher.register(game.update);
})(window.app.stores.game = {});
