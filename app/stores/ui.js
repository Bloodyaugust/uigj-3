(function (ui) {
  var state = {
    view: 'make-connection',
    room: '',
    timeToNextDay: 0,
    day: 0,
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

    if (data.type === 'game-update') {
      state.view = 'game';
      state.timeToNextDay = data.game.timeToNextDay;
      state.day = data.game.day;

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

    if (data.type === 'game-start') {
      if (app.stores.client.getType !== 'host') {
        state.view = 'game-info';
      }

      ui.emit();
    }

    if (data.type === 'game-time') {
      state.timeToNextDay = data.timeToNextDay;

      ui.emit();
    }

    if (data.type === 'game-end') {
      state.view = 'game-end';
      state.winState = data.game.winState;

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
