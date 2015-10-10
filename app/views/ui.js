(function (ui) {
  var $body = $('body'),
    $controls = $body.find('.controls'),
    $spawnTab = $controls.find('.spawn-tabs'),
    $spawnTabs = $spawnTab.find('div'),
    $nav = $body.find('nav'),
    $viewTabs = $body.find('nav .icon'),
    $infoViews = $body.find('section.info'),
    $achievements = $body.find('section.achievements');

  ui.render = function (data) {
    $controls.children('div').addClass('hide');
    $controls.find('.' + data.spawnTab).removeClass('hide');

    $spawnTabs.removeClass('active');
    $spawnTab.find('.' + data.spawnTab).addClass('active');

    $viewTabs.removeClass('active');
    $nav.find('.icon.' + data.infoView).addClass('active');

    $infoViews.addClass('hide');
    $body.find('section.' + data.infoView).removeClass('hide');
  };

  ui.setAchievements = function (data) {
    $achievements.find('div').removeClass('active');

    for (var i = 0; i < data.length; i++) {
      if (data[i].achieved) {
        $achievements.find('div.' + data[i].class).addClass('active');
      }
    }
  };

  $spawnTab.find('div').on('click', function (e) {
    $el = $(e.currentTarget);

    app.actions.spawnTabSelect($el.data().tabUnit);
  });

  $controls.find('div>span').on('click', function (e) {
    $el = $(e.currentTarget);

    app.actions.spawnUnit($el.parent().data().unit, $el.attr('class'));
  });

  $viewTabs.on('click', function (e) {
    $el = $(e.currentTarget);

    app.actions.infoViewSelect($el.data().view);
  });

  app.stores.ui.register(ui.render);
  app.stores.achievements.register(ui.render);
})(window.app.views.ui = {});
