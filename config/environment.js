/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'jammies',
    environment: environment,
    
    contentSecurityPolicy: {
      'connect-src': "'self' https://auth.firebase.com wss://*.firebaseio.com https://api.spotify.com https://content.googleapis.com", 
      'font-src': "'self' data: fonts.gstatic.com https://maxcdn.bootstrapcdn.com/",
      'img-src': "'self' https://i.scdn.co/image/ https://lh3.googleusercontent.com",
      'style-src': "'self' 'unsafe-inline' fonts.googleapis.com https://maxcdn.bootstrapcdn.com",
      'frame-src': "'self' https://*.firebaseio.com https://embed.spotify.com https://www.youtube.com/embed/",
      'script-src': "'self' 'unsafe-eval' https://*.firebaseio.com https://maxcdn.bootstrapcdn.com"
    },
    firebase: 'https://thejams.firebaseio.com/',
    torii: {
      sessionServiceName: 'session'
    },
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
