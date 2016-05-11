'use strict';

/**
 * @ngdoc service
 * @name unleashApp.userService
 * @description
 * # userService
 * Methods related to controlling user authentication.
 */
angular.module('unleashApp')
  .factory('userService', function($rootScope, $window, $location, $http, FBURL, Auth, $compile, $q, growl) {
    var ref = new $window.Firebase(FBURL);
    var cachedUsers;

    var isFromXteam = function(email) {
        var domain = '@x-team.com';

        return email.indexOf(domain) !== -1;
    };

    var parseEmail = function(email) {
      return email.match(/^([^@]*)@/)[1];
    };

    return {

      register: function(googleUser) {
        var defer = $q.defer();
        var user = {
          id: googleUser.getBasicProfile().getId(),
          fullName: googleUser.getBasicProfile().getName(),
          isAdmin: false,
          picture: googleUser.getBasicProfile().getImageUrl(),
          firstName: googleUser.getBasicProfile().getGivenName(),
          lastName: googleUser.getBasicProfile().getFamilyName(),
          email: googleUser.getBasicProfile().getEmail(),
          username: parseEmail(googleUser.getBasicProfile().getEmail())
        };

        if (isFromXteam(googleUser.getBasicProfile().getEmail())) {
          $http.post(
            'https://txkaf3ohhf.execute-api.us-west-2.amazonaws.com/staging/profiles',
            user
          ).then(function() {
            defer.resolve(user);
          }).catch(function() {
            console.error('There was a problem registering the user.');
            defer.reject(new Error('There was a problem registering the user.'));
          });
        } else {
          defer.reject(new Error('Try using an x-team email address. Not registered.'));
        }

        return defer.promise;
      },

      list: function() {
        var defer = $q.defer();

        if (cachedUsers) {
          defer.resolve(cachedUsers);
        } else {
          $http.get('https://txkaf3ohhf.execute-api.us-west-2.amazonaws.com/staging/profiles').then(function(response) {
            defer.resolve(response.data.Items);
          }).catch(function() {
            console.error('There was a problem loading the users.');
            defer.reject(new Error('There was a problem loading the users.'));
          });
        }

        return defer.promise;
      },

      getById: function (id) {
        var defer = $q.defer();

        this.list().then(function(users) {
          users.map(function(user) {
            if (user.id === id) {
              defer.resolve(user);
            }
          });
          defer.resolve(null);
        });

        return defer.promise;
      },

      /**
       * Login using OAuth
       */
      login: function(googleUser) {
        var defer = $q.defer();
        var self = this;

        this.getById(googleUser.getBasicProfile().getId()).then(function(user) {
          if (user) {
            defer.resolve(user);
          } else {
            self.register(googleUser)
              .then(function(user) {
                defer.resolve(user);
              })
              .catch(function(e) {
                growl.error(e.message);
                defer.reject(e);
              });
          }
        });

        return defer.promise;
      },

      /**
       * Actions related to logout
       */
      logout: function() {
        $rootScope.user = null;
        $location.path('/');
        growl.success('Logged out successfully.');
      },

      /**
       * Returns an username and an account level for a given UID or for a currently signed in user
       * @param data
       * @returns {Promise} Username
       */
      getUserDetails: function(data) {
        var deferred = $q.defer();
        var uid;

        if(data || Auth.$getAuth()) {
          uid = data || Auth.$getAuth().uid;

          var queryRef = ref.child('users');

          queryRef.once('value', function (snapshot) {
            var storedUsers = snapshot.val() || {};

            if (Object.keys(storedUsers) && storedUsers[uid]) {
              deferred.resolve({
                email: storedUsers[uid].google.email,
                fullName: storedUsers[uid].google.displayName,
                picture: storedUsers[uid].google.cachedUserProfile.picture,
                username: storedUsers[uid].username,
                /*jshint camelcase: false */
                isAdmin: storedUsers[uid].is_admin
                /*jshint camelcase: true */
              });
            } else {
              deferred.reject(new Error('No user with uid:"' + uid + '" registered.'));
            }
          });
        }

        else {
          deferred.reject(new Error('No data provided.'));
        }

        return deferred.promise;
      },

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

      findBySkill: function(slug) {
        var deferred = $q.defer();

        var usersRef = ref.child('users');

        usersRef.once('value', function (users) {
          var matchingUsers = [];
          users.forEach(function (user) {
            user.child('skills').forEach(function (skill) {
              if (skill.val() === slug) {
                matchingUsers.push(user.val());
              }
            });
          });

          deferred.resolve(matchingUsers);
        });

        return deferred.promise;
      },

      addSkillToUser: function(user, skill) {
        var deferred = $q.defer(),
            skillsRef = ref.child('users').child(user.$id).child('skills');

        skillsRef.on('value', function(snapshot) {
          var isAlreadyAdded = false;
          snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.val() === skill.slug) {
              isAlreadyAdded = true;
            }
          });
          if (!isAlreadyAdded) {
            skillsRef.push(skill.slug);
          }
          deferred.resolve();
        });

        return deferred.promise;
      }
    };
  });
