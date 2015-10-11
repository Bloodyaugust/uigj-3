(function (client) {
  var state = {
    roomState: app.constants['CLIENT_UNCONNECTED'],
    room: '',
    clientName: '',
    clientType: '',
  },
  listeners = [];

  client.update = function (data) {
    if (data.type === 'client-connect') {
      state.roomState = app.constants['CLIENT_CONNECTED'];
      client.emit();
    }

    if (data.type === 'client-name') {
      state.clientName = data.name;
      client.emit();
    }

    if (data.type === 'view-select' && data.view === 'hosting') {
      state.clientName = 'host';
      state.clientType = 'host';
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

  app.dispatcher.register(client.update);
})(window.app.stores.client = {});
