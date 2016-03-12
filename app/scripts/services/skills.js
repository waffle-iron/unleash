'use strict';

/**
 * @ngdoc service
 * @name unleashApp.skillService
 * @description
 * # skillService
 * Methods related to adding or removing user skills.
 */
angular.module('unleashApp')
  .factory('skillService', function($window, $q, $http, $firebaseArray, FBURL, dataPath) {
    var ref = new $window.Firebase(FBURL).child('skills');
    var skillList = null;
    var skills = {};

    skills.stored = ref;

    /**
     * Populate a predefined set of skills to the database
     * @returns {Promise} A reference to the Firebase object
     */
    var populateSkills = function() {
      return $q(function() {
        $http.get(dataPath + 'skills.json').then(function(obj) {
          return skills.stored.set(obj.data);
        }).catch(function() {
          console.error('There was a problem loading the skills data file.');
        });
      });
    };

    return {
      /**
       * List initial skills
       */
      list: $q(function(resolve) {
        skillList = $firebaseArray(skills.stored);

        skillList.$loaded().then(function() {
          if (skillList.length) {
            resolve(skillList);
          }
          else {
            // No skills stored in Firebase, instantiate
            return populateSkills();
          }

        });
      }),

      /**
       * Add a new skill
       * @param data Skill data
       * @returns {Promise}
       */
      add: function(data) {
        var defer = $q.defer();

        if (!data || !data.name) {
          defer.reject(new Error('No skill data given.'));
        } else {
          var skill = {
            'name': data.name
          };

          skillList.$add(skill).then(function () {
            defer.resolve();
          });
        }

        return defer.promise;
      },

      getSkillNameById: function(id) {
        return this.list.then(function(skills) {
          return _.find(skills, function(skill) {
            return skill.$id === id;
          }).name;
        });
      },

      isUserAlreadyAddedToSkill: function (skillId, username) {
        var usersRef =  ref.child(skillId).child('users');

        return $q(function(resolve, reject) {
          usersRef.once('value', function(snapshot) {
            snapshot.forEach(function (childSnapshot){
              if (childSnapshot.val() === username) {
                reject();
              }
            });

            resolve();
          });
        });
      },

      findUsernamesBySkill: function (skillId) {
        var defer = $q.defer();

        ref.child(skillId).child('users').once('value', function (snapshot) {
          var usernames = [];
          snapshot.forEach(function (username) {
            usernames.push(username.val());
          });
          defer.resolve(usernames);
        });

        return defer.promise;
      },

      addUserToSkill: function (skillId, username) {
        this.isUserAlreadyAddedToSkill(skillId, username).then(function() {
          ref.child(skillId).child('users').push(username);
        });
      }
    };
  });
