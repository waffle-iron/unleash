'use strict';

/**
 * @ngdoc service
 * @name unleashApp.authService
 * @description
 * # authService
 * A re-usable factory that generates the $firebaseAuth instance.
 */
angular.module('unleashApp')
  .factory('Auth', ['$window', 'FBURL', '$firebaseAuth', function($window, FBURL, $firebaseAuth) {
    var ref = new $window.Firebase(FBURL);
    return $firebaseAuth(ref);
  }]);
