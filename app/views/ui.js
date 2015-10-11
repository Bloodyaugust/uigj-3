(function (ui) {
  var $body = $('body'),
    $mainContainer = $body.find('.main-content'),
    $views = $mainContainer.children('section'),
    $findingRoom = $mainContainer.find('.finding-room'),
    $roomName = $mainContainer.find('.card.room .room-name'),
    $playerConfig = $mainContainer.find('.player-config'),
    $playerNameInput = $playerConfig.find('input[name="name"]'),
    $playerCodeInput = $playerConfig.find('input[name="code"]'),
    $gameStart = $mainContainer.find('.game-start');

  ui.render = function (data) {
    $views.addClass('hide');
    $views.filter('.' + data.view).removeClass('hide');

    $roomName.html(data.room);
    if (data.room) {
      $findingRoom.addClass('hide');
    }
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

  app.stores.ui.register(ui.render);
})(window.app.views.ui = {});
