(function (ui) {
  var state = {
    gameState: {},
    clientState: {}
  },
  listeners = [];

  ui.update = function (data) {
    if (data.type === 'game') {
      state.gameState = data.game;
      ui.emit();
    }

    if (data.type === 'client') {
      ui.emit();
    }
  };

  ui.register = function (callback) {
    listeners.push(callback);
  };

  ui.emit = function () {
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](state);
    }
  };

  app.dispatcher.register(ui.update);
})(window.app.stores.ui = {});
