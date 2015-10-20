(function (constants) {
  constants = {
    'CLIENT_CONNECTED': 1,
    'CLIENT_UNCONNECTED': 0,
    'GAME_STATE': {
      'SETUP': 0,
      'INTRO': 1,
      'ROUND': 2,
      'RECAP': 3,
      'END': 4,
    },
    'WIN_STATE': {
      'NONE': 0,
      'CIVILIANS': 1,
      'MURDERERS': 2,
    },
  };
})(window.app.constants = {});
