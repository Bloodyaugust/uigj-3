(function (dispatcher) {
  var listeners = [];

  dispatcher.dispatch = function (data) {
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](data);
    }
  };

  dispatcher.register = function (callback) {
    listeners.push(callback);
  };
})(window.app.dispatcher = {});
