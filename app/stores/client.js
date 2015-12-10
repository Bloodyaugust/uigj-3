(function (client) {
  var state = {
    roomState: app.constants['CLIENT']['CLIENT_UNCONNECTED'],
    room: '',
    clientName: '',
    clientType: app.constants['CLIENT']['CLIENT_NONE'],
    view: app.constants['CLIENT']['VIEW']['INDEX'],
  },
  listeners = [];

  client.update = function (data) {
    if (data.type === 'client-connect') {
      state.roomState = app.constants['CLIENT']['CLIENT_CONNECTED'];
      client.emit();
    }

    if (data.type === 'client-name') {
      state.clientName = data.name;
      client.emit();
    }

    if (data.type === 'view-select' && data.view === 'player-config') {
      state.clientType = app.constants['CLIENT']['CLIENT_PLAYER'];
      state.view = app.constants['CLIENT']['VIEW']['PLAYER_CONFIG'];
      client.emit();
    }

    if (data.type === 'view-select' && data.view === 'hosting') {
      state.clientName = 'host';
      state.clientType = app.constants['CLIENT']['CLIENT_HOST'];
      state.view = app.constants['CLIENT']['VIEW']['HOST_CONFIG'];
      app.actions.createRoom();
      client.emit();
    }

    if (data.type === 'players-configured') {
      for (var i = 0; i < data.players.length; i++) {
        if (data.players[i].name === state.clientName) {
          state.clientType = data.players[i].type;
        }
      }
      client.emit();
    }

    if (data.type === 'new-room') {
      room = data.room;
    }

    console.log('Client update ', data);
  };

  client.register = function (callback) {
    listeners.push(callback);
  };

  client.emit = function () {
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](state);
    }
  };

  client.getName = function () {
    return state.clientName;
  };

  client.getType = function () {
    return state.clientType;
  };

  client.getState = function () {
    return state;
  };

  app.dispatcher.register(client.update);
})(window.app.stores.client = {});
