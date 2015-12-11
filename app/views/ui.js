(function (ui) {
  var $body = $('body'),
    $mainContainer = $body.find('.main-content'),
    $views = $mainContainer.children('section'),
    $findingRoom = $mainContainer.find('.finding-room'),
    $roomNameContainer = $mainContainer.find('.card.room'),
    $roomName = $mainContainer.find('.card.room .room-name'),
    $playerConfig = $mainContainer.find('.player-config'),
    $playerNameInput = $playerConfig.find('input[name="name"]'),
    $playerCodeInput = $playerConfig.find('input[name="code"]'),
    $playerInfo = $mainContainer.find('.player-info'),
    $gameInfo = $mainContainer.find('.game-info'),
    $murderer = $gameInfo.find('.murderer'),
    $civilian = $gameInfo.find('.civilian'),
    $gameStart = $mainContainer.find('.game-start'),
    $game = $mainContainer.find('.game'),
    $gameDay = $game.find('.game-day'),
    $gameTime = $game.find('.game-time'),
    $gameEnd = $mainContainer.find('.game-end'),
    $hostConfigPlayers = $mainContainer.find('.hosting .players'),
    $waitingPlayerPlayers = $mainContainer.find('.waiting-players .players');

  ui.gameRender = function (data) {
    var clientState = app.stores.client.getState(),
      players = '';

    if (clientState.view === app.constants['CLIENT']['VIEW']['HOST_CONFIG']) {
      $roomNameContainer.removeClass('hide');
      $findingRoom.addClass('hide');
      $roomName.html(data.name);
    }

    if (clientState.clientType === app.constants['CLIENT']['CLIENT_HOST']) {
      if (clientState.view === app.constants['CLIENT']['VIEW']['HOST_CONFIG']) {
        if (data.players) {
          for (var i = 0; i < data.players.length; i++) {
            players += '<div class="player">' + data.players[i].name + '</div>';
          }
          $hostConfigPlayers.html(players);
        }
      }
    } else if (clientState.clientType === app.constants['CLIENT']['CLIENT_PLAYER']) {
      for (i = 0; i < data.players.length; i++) {
        players += '<div class="player">' + data.players[i].name + '</div>';
      }
      $waitingPlayerPlayers.html(players);
    }
  };

  ui.clientRender = function (data) {
    var gameState = app.stores.game.getState();

    $views.addClass('hide');

    if (data.clientType === app.constants['CLIENT']['CLIENT_HOST']) {
      console.log('rendering host');
      console.log(gameState);
      if (data.view === app.constants['CLIENT']['VIEW']['HOST_CONFIG']) {
        $views.filter('.hosting').removeClass('hide');
      }
      if (data.view === app.constants['CLIENT']['VIEW']['HOST_INTRO']) {
        $views.filter('.host-intro').removeClass('hide');
      }
    } else if (data.clientType === app.constants['CLIENT']['CLIENT_PLAYER']) {
      console.log('rendering player');
      if (data.view === app.constants['CLIENT']['VIEW']['PLAYER_CONFIG']) {
        $views.filter('.player-config').removeClass('hide');
      }
      if (data.view === app.constants['CLIENT']['VIEW']['PLAYER_WAIT']) {
        $views.filter('.waiting-players').removeClass('hide');
      }
    } else {
      console.log('rendering index');
      $views.filter('.make-connection').removeClass('hide');
    }
  };

  $mainContainer.find('.view-select').on('click', function (e) {
    var $el = $(e.currentTarget);

    console.log($el.data().view);
    app.actions.viewSelect($el.data().view);
  });

  $playerConfig.find('.button').on('click', function (e) {
    app.actions.playerJoin($playerCodeInput.val(), $playerNameInput.val());
  });

  $gameStart.on('click', function (e) {
    app.actions.startGame();
  });

  app.stores.game.register(ui.gameRender);
  app.stores.client.register(ui.clientRender);
})(window.app.views.ui = {});
