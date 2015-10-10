(function (ui) {
  var $body = $('body'),
    $mainContainer = $body.find('.main-content'),
    $views = $mainContainer.children('section');

  ui.render = function (data) {
    $views.addClass('hide');
    $views.filter('.' + data.view).removeClass('hide');
  };

  $mainContainer.find('.view-select').on('click', function (e) {
    var $el = $(e.currentTarget);

    app.actions.viewSelect($el.data().view);
  });

  app.stores.ui.register(ui.render);
})(window.app.views.ui = {});
