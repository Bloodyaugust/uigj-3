(function (client) {
  var state = {
    roomState: app.constants['CLIENT_UNCONNECTED'],
    room: '',
    clientName: '',
  },
  listeners = [];

  client.update = function (data) {
    if (data.type === 'client-connect') {
      state.roomState = app.constants['CLIENT_CONNECTED'];
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

  app.dispatcher.register(client.update);
})(window.app.stores.client = {});
