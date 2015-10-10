(function (actions) {
  actions.heartbeat = function () {
    app.dispatcher.dispatch({
      type: 'heartbeat',
      timeStamp: new Date
    });
  };

  actions.viewSelect = function (view) {
    app.dispatcher.dispatch({
      type: 'view-select',
      view: view
    });
  };
})(window.app.actions = {});
