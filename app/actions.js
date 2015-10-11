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

  actions.createRoom = function () {
    app.dispatcher.dispatch({
      type: 'create-room',
      remote: true
    });
  };

  actions.playerJoin = function (room, playerName) {
    app.dispatcher.dispatch({
      type: 'player-join',
      player: {
        name: playerName
      },
      room: room,
      remote: true,
    });
  };

  actions.startGame = function () {
    app.dispatcher.dispatch({
      type: 'game-start',
      room: '',
      remote: true
    });
  };
})(window.app.actions = {});
