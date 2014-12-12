'use strict';

var services = angular.module('unleashApp.services', ['firebase']);

  // let's create a re-usable factory that generates the $firebaseAuth instance
services.factory('Auth', ['$window', 'FBURL', '$firebaseAuth', function($window, FBURL, $firebaseAuth) {
    var ref = new $window.Firebase(FBURL);
    return $firebaseAuth(ref);
  }]);

services.factory('userService', ['$window', 'FBURL', 'Auth', function($window, FBURL, Auth) {
  var ref = new $window.Firebase(FBURL);

  var checkIfUserExists = function(callback) {
    var queryRef = ref.child('users');

    queryRef.once('value', function(snapshot) {
      var storedUsers = snapshot.val();
      var currentUser = Auth.$getAuth().uid;

      callback(currentUser in storedUsers ? 1 : 0);
    });
  };

  var isFromXteam = function(data) {
    // Check if authenticated user’s email address is from x-team.com domain

    var domain = 'x-team.com';
    var email = data.google.email || '';

    if (!data) {
      return;
    }

    return email.indexOf(domain) !== -1 ? 1 : 0;
  };

  return {
    register: function(authData) {
      var isValidLogin = isFromXteam(authData);

      if (authData) {
        if (isValidLogin) {
          ref.child('users').child(authData.uid).set(authData);
        } else {
          console.log('Try x-team login. Not registered.');
          this.logout();
        }
      }
    },
    login: function() {
      var _this = this;

      // Login to google using a pop up
      ref.authWithOAuthPopup('google', function(err, authData) {
        if (err) {

          // If the pop up won’t fire, authenticate using a redirect
          if (err.code === 'TRANSPORT_UNAVAILABLE') {
            ref.authWithOAuthRedirect('google', function(err) {
              console.error('There was a problem logging in: ' + err);
            });

          } else {
            console.error('There was a problem logging in: ' + err);
          }
        }

        if(authData) {
          // User is logged in

          checkIfUserExists(function(doesExist) {
            if(!doesExist) {
              _this.register(authData);
            }
          });
        }
      }, {
        scope: 'email'
      });
    },

    logout: function() {
      ref.unauth();
    },

    listen: function() {
      ref.onAuth(function(authData) {
        if (authData) {
          // display logged in userbox
          console.log('change: logged in');
        } else {
          // display logged out userbox
          console.log('change: logged out');
        }
      });
    }
  };
}]);
