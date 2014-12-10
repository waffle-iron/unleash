'use strict';

var services = angular.module('unleashApp.services', ['firebase']);

  // let's create a re-usable factory that generates the $firebaseAuth instance
services.factory('Auth', ['$window', 'FBURL', '$firebaseAuth', function($window, FBURL, $firebaseAuth) {
    var ref = new $window.Firebase(FBURL);
    return $firebaseAuth(ref);
  }]);

services.factory('userService', ['fbutil', '$window', function(fbutil, $window) {
  return {
    login: function() {
      var ref = new $window.Firebase('https://radiant-fire-1291.firebaseio.com/');

      ref.authWithOAuthPopup('github', function(err, authData) {
        console.log(authData);
      });
      //then(function(authData) {
      //  console.log(authData);
      //  window.location.href = '/';
      //}).catch(function(error) {
      //  console.error('Authentication failed: ', error);
      //});
    },
    logout: function() {
      fbutil.unauth();
    }
  };
}]);
