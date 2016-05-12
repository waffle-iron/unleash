'use strict';

/**
 * @ngdoc service
 * @name unleashApp.userService
 * @description
 * # userService
 * Methods related to controlling user authentication.
 */
angular.module('unleashApp')
  .factory('userService', function($rootScope, $window, $location, $http, FBURL, $q, growl) {
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

      getById: function(id) {
        var defer = $q.defer();

        this.list().then(function(users) {
          users.map(function(user) {
            if (user.id === id || user.id === 'google:' + id) {
              defer.resolve(user);
            }
          });
          defer.resolve(null);
        });

        return defer.promise;
      },

      getByUsername: function(username) {
        var defer = $q.defer();

        this.list().then(function(users) {
          users.map(function(user) {
            if (user.username === username) {
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
