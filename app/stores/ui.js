(function (ui) {
  var state = {
    view: 'make-connection',
    room: ''
  },
  listeners = [];

  ui.update = function (data) {
    if (data.type === 'view-select') {
      state.view = data.view;

      if (state.view === 'hosting') {
        app.actions.createRoom();
      }

      ui.emit();
    }

    if (data.type === 'new-room' && state.view === 'hosting') {
      state.room = data.room;

      ui.emit();
    }

    if (data.type === 'player-join' && state.view === 'player-config') {
      state.view = 'waiting-players';

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
