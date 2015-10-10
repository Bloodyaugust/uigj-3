window.app = {};
(function (app) {
  app.stores = {};
  app.views = {};

  window.setInterval(function () {
    app.actions.heartbeat();
  }, 1000);
})(window.app);
