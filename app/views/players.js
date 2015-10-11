(function (players) {
  var $body = $('body'),
    $players = $body.find('.players');

  players.render = function (data) {
    var playersHTML = '';

    for (var i = 0; i < data.players.length; i++) {
      playersHTML += '<div class="player">' + data.players[i].name + '</div>';
    }
    $players.html(playersHTML);
  };

  app.stores.players.register(players.render);
})(window.app.views.players = {});
