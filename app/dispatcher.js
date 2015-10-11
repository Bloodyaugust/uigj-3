(function (dispatcher) {
  var listeners = [];

  dispatcher.dispatch = function (data) {
    if (!data.remote) {
      console.log(data.type);
      for (var i = 0; i < listeners.length; i++) {
        listeners[i](data);
      }
    } else {
      app.socket.emit('', data);
    }
  };

  dispatcher.register = function (callback) {
    listeners.push(callback);
  };

  app.socket.on('', app.dispatcher.dispatch);
})(window.app.dispatcher = {});
