'use strict';

/**
 * @ngdoc service
 * @name unleashApp.userService
 * @description
 * # userService
 * Methods related to controlling user authentication.
 */
angular.module('unleashApp')
  .factory('userService', function($window, FBURL, Auth, $compile, $q, growl) {
    var ref = new $window.Firebase(FBURL);

    /**
     * Check if user is already registered
     * @param callback
     */
    var checkIfUserExists = function(callback) {
      var queryRef = ref.child('users');

      queryRef.once('value', function(snapshot) {
        var storedUsers = snapshot.val() || {};
        var currentUser = Auth.$getAuth().uid;

        callback(currentUser in storedUsers);
      });
    };

    /**
     * Check if authenticated user’s email address is from x-team.com domain
     * @param data OAuth data
     * @returns {boolean}
     */
    var isFromXteam = function(data) {
      if (data) {
        var domain = '@x-team.com';
        var email = data.google.email || '';

        return email.indexOf(domain) !== -1 ? 1 : 0;
      }
    };

    /**
     * Get username from a given email address
     * @param email
     * @returns {*}
     */
    var parseEmail = function(email) {
      return email.match(/^([^@]*)@/)[1];
    };

    return {
      /**
       * Add new user data to firebase
       * @param authData User data from OAuth
       */
      register: function(authData) {
        var isValidLogin = isFromXteam(authData);

        if (authData) {
          if (isValidLogin) {
            ref.child('users').child(authData.uid).set(authData);
          } else {
            growl.error('Try using an x-team email address. Not registered.');
            this.logout();
          }
        }
      },

      /**
       * Login using OAuth
       */
      login: function() {
        var self = this;

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
                authData.username = parseEmail(authData.google.email);
                self.register(authData);
              } else {
                growl.success('Welcome back, ' + authData.google.displayName + '!');
              }
            });
          }
        }, {
          scope: 'email'
        });
      },

      logout: function() {
        ref.unauth();
        growl.success('Logged out successfully.');
      },

      /**
       * Gets username of a logged in user
       */
      getUsername: $q(function(resolve, reject) {
        if(Auth.$getAuth()) {
          var queryRef = ref.child('users');

          queryRef.once('value', function(snapshot) {
            var storedUsers = snapshot.val() || {};
            var currentUser = Auth.$getAuth().uid;

            if (Object.keys(storedUsers).length) {
              resolve(storedUsers[currentUser].username);
            } else {
              reject(Error('Object is empty'));
            }
          });
        }
      }),

      /**
       * Gets UID from an username
       * @param username
       * @returns {promise} UID
       */
      getUserUid: function(username) {
        return $q(function(resolve, reject) {
          var queryRef = ref.child('users');
          var users = {};

          queryRef.once('value', function (snapshot) {
            users.all = snapshot.val() || {};

            for (var uid in users.all) {
              if (users.all[uid].username === username) {
                users.current = uid;
              }
            }

            if(users.current) {
              resolve(users.current);
            } else {
              reject(Error('No uid for ' + username + ' found!'));
            }
          });
        });
      },

      /**
       * Watch for changes in auth
       * @param isLoggedInInitially
       */
      listen: function(isLoggedInInitially) {
        ref.onAuth(function(authData) {
          // Only detect changes
          // @todo: Display notifications related to auth changes
          if (authData && !isLoggedInInitially) {
            //$window.location.href = '/';
            console.log('logged in: ', authData);
          } else if (!authData && isLoggedInInitially) {
            console.log('logged out: ', authData);
          }
        });
      }
    };
  });
