(function() {
  'use strict';

  var FBURL = 'https://unleash-app-staging.firebaseio.com';

  // Env variable to be replaced by grunt
  if ('@@UNLEASH_ENV' === 'production') {
    FBURL = 'https://unleash-app.firebaseio.com';
  }

  angular.module('firebase.config', [])
    .constant('FBURL', FBURL);
})();
