window.app = {};
(function (app) {
  app.stores = {};
  app.views = {};
  app.socket = io('//:3000');

  window.setInterval(function () {
    //app.actions.heartbeat();
  }, 1000);

  $.fn.enterKey = function (callback) {
    return this.each(function () {
      $(this).keypress(function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);

        if (keycode === 13) {
          callback.call(this, e);
        }
      });
    });
  }
})(window.app);
