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
    'INTRO_LENGTH': 15 * 1000,
    'RECAP_LENGTH': 10 * 1000,
    'DAY_LENGTH': 30 * 1000,
    'UPDATE_INTERVAL': 16,
  };

  if (typeof window === 'undefined') {
    module.exports = constants;
  } else {
    window.app.constants = constants;
  }
})({});
