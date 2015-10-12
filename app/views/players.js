(function (players) {
  var $body = $('body'),
    $players = $body.find('.players'),
    $playersControls = $body.find('.players-controls'),
    $lynch, $murder;

  players.render = function (data) {
    var playersHTML = '';

    for (var i = 0; i < data.players.length; i++) {
      playersHTML += '<div class="player' + (data.players[i].state !== 'alive' ? ' dead' : '') + '">' + data.players[i].name + '</div>';
    }
    $players.html(playersHTML);
  };

  players.renderControls = function () {
    var players = app.stores.players.getPlayers(),
      playersControlsHTML = '';

    for (i = 0; i < players.length; i++) {
      if (players[i].name !== app.stores.client.getName()) {
        playersControlsHTML += '<div class="player controls' + (players[i].state !== 'alive' ? ' dead disabled' : '') + '" data-player-name="' + players[i].name + '">' + players[i].name + '<div class="button lynch">lynch</div>';
        if (app.stores.client.getType() === 'murderer' && players[i].name !== app.stores.client.getName()) {
          playersControlsHTML += '<div class="button murder">murder</div>';
        }
        playersControlsHTML += '</div>';
      }
    }
    $playersControls.html(playersControlsHTML);

    $lynch = $playersControls.find('.lynch');
    $murder = $playersControls.find('.murder');

    $lynch.on('click', function (e) {
      var $el = $(e.currentTarget),
        $parent = $el.parent();

      if (!$el.hasClass('disabled')) {
        $lynch.addClass('disabled');
        app.actions.playerLynch($parent.data().playerName);
      }
    });

    $murder.on('click', function (e) {
      var $el = $(e.currentTarget),
      $parent = $el.parent();

      if (!$el.hasClass('disabled')) {
        $murder.addClass('disabled');
        app.actions.playerMurder($parent.data().playerName);
      }
    });
  };

  app.stores.players.register(players.render);
})(window.app.views.players = {});
