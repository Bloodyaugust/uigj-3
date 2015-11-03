(function (ui) {
  var $body = $('body'),
    $mainContainer = $body.find('.main-content'),
    $views = $mainContainer.children('section'),
    $findingRoom = $mainContainer.find('.finding-room'),
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
    $gameEnd = $mainContainer.find('.game-end');

  var lastView = '', lastDay = 0;

  ui.gameRender = function (data) {
    var clientName, clientType;

    $views.addClass('hide');
    $views.filter('.' + data.view).removeClass('hide');

    $roomName.html(data.room);
    if (data.room) {
      $findingRoom.addClass('hide');
    }

    if (data.view === 'hosting') {
      $playerInfo.addClass('hide');
    }

    if (data.view === 'game-info') {
      clientType = app.stores.client.getType();

      $gameInfo.find('.player-type').html(clientType);
      if (clientType === 'murderer') {
        $murderer.removeClass('hide');
        $civilian.addClass('hide');
      }
    }

    if (data.view === 'game') {
      $gameDay.html(data.day);
      $gameTime.html(Math.floor(data.timeToNextDay / 1000));

      if (data.day !== lastDay) {
        $mainContainer.find('.murder').removeClass('disabled');
        $mainContainer.find('.lynch').removeClass('disabled');
        lastDay = data.day;
      }
    }

    if (data.view === 'game-end') {
      $gameEnd.html(data.winState + ' win! Reload the page to play again.');
    }

    if (lastView !== 'game-info' && data.view === 'game-info') {
      if (app.stores.client.getType() !== 'host') {
        app.views.players.renderControls();
      } else {
        $game.find('.players').removeClass('hide');
      }
    }
  };

  ui.clientRender = function (data) {

  };

  $mainContainer.find('.view-select').on('click', function (e) {
    var $el = $(e.currentTarget);

    app.actions.viewSelect($el.data().view);
  });

  $playerConfig.find('.button').on('click', function (e) {
    app.actions.playerJoin($playerCodeInput.val(), $playerNameInput.val());
  });

  $gameStart.on('click', function (e) {
    app.actions.startGame();
  });

  app.stores.ui.register(ui.gameRender);
  app.stores.client.register(ui.clientRender);
})(window.app.views.ui = {});
