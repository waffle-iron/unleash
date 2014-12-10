'use strict';

var services = angular.module('unleashApp.services', ['firebase']);

  // let's create a re-usable factory that generates the $firebaseAuth instance
services.factory('Auth', ['$window', 'FBURL', '$firebaseAuth', function($window, FBURL, $firebaseAuth) {
    var ref = new $window.Firebase(FBURL);
    return $firebaseAuth(ref);
  }]);

services.factory('userService', ['$window', 'FBURL', function($window, FBURL) {
  var ref = new $window.Firebase(FBURL);

  return {
    login: function() {
      ref.authWithOAuthPopup('google', function(err, authData) {
        if (err) {
          console.error('There was a problem logging in: ' + err);
          return;
        }

        console.log(authData);
        window.location.href = '/';
      }, {
        scope: 'email'
      });
    },
    logout: function() {
      ref.unauth();
      window.location.href = '/';
    },
    testLogin: function() {
      ref.onAuth(function(authData) {
        if (authData) {
          console.log('UID: ' + authData.uid);
        } else {
          console.log('logged out');
        }
      });
    }
  };
}]);
