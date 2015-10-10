(function (ui) {
  var state = {
    view: 'make-connection',
  },
  listeners = [];

  ui.update = function (data) {
    if (data.type === 'view-select') {
      state.view = data.view;
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
