'use strict';

/**
 * @ngdoc service
 * @name unleashApp.userService
 * @description
 * # userService
 * Methods related to controlling user authentication.
 */
angular.module('unleashApp')
  .factory('userService', function($rootScope, $location, localStorageService, $http, $q, growl, PROFILES_API_URL) {
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
            PROFILES_API_URL,
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
          $http.get(PROFILES_API_URL).then(function(response) {
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
            if (user.id === id) {
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
            localStorageService.set('logged_in', true);
            defer.resolve(user);
          } else {
            self.register(googleUser)
              .then(function(user) {
                localStorageService.set('logged_in', true);
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
        localStorageService.set('logged_in', false);
        $location.path('/');
        growl.success('Logged out successfully.');
      },

      findBySkill: function(slug) {
        var self = this;
        var deferred = $q.defer();

        $http.get(
          PROFILES_API_URL + '?skillId=' + slug
        ).then(function(response) {
          var result = [];
          if (response.data.Count) {
            var userIds = [];
            for(var i = 0; i < response.data.Count; i++) {
              userIds.push(response.data.Items[i].userId);
            }
            self.list().then(function(users) {
              result = users.filter(function(user) {
                if (userIds.indexOf(user.id) !== -1) {
                  return true;
                }
              });
              deferred.resolve(result);
            });
          } else {
            deferred.resolve(result);
          }
        }).catch(function() {
          growl.error('There was a problem retrieving the users.');
          deferred.reject(new Error('There was a problem retrieving the users.'));
        });

        return deferred.promise;
      },

      addSkillToUser: function(user, skill) {
        var deferred = $q.defer();

        $http.post(
          PROFILES_API_URL + '/' + user.id + '/skills',
          {
            skillId: skill.slug
          }
        ).then(function() {
          deferred.resolve();
        }).catch(function() {
          growl.error('There was a problem adding the skill.');
          deferred.reject(new Error('There was a problem adding the skill.'));
        });

        return deferred.promise;
      }
    };
  });
