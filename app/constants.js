(function (constants) {
  constants = {
    'CLIENT': {
      'VIEW': {
        'INDEX': 0,
        'HOST_CONFIG': 1,
        'HOST_INTRO': 2,
        'HOST_RECAP': 3,
        'PLAYER_CONFIG': 4,
        'PLAYER_WAIT': 5,
        'PLAYER_INFO': 6,
        'PLAYER_ROUND': 7,
        'PLAYER_GAME_END': 8,
      },
      'CLIENT_CONNECTED': 0,
      'CLIENT_UNCONNECTED': 1,
      'CLIENT_HOST': 0,
      'CLIENT_PLAYER': 1,
      'CLIENT_NONE': 2
    },
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
