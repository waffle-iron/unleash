'use strict';

/**
 * @ngdoc service
 * @name unleashApp.skillService
 * @description
 * # skillService
 * Methods related to adding or removing user skills.
 */
angular.module('unleashApp')
  .factory('skillService', function($q, $http, growl, SKILLS_API_URL) {

    return {
      /**
       * List initial skills
       */
      list: $q(function(resolve, reject) {
          $http.get(SKILLS_API_URL).then(function(response) {
              resolve(response.data);
          }).catch(function() {
            console.error('There was a problem loading the skills.');
            reject(new Error('There was a problem loading the skills.'));
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
          $http.post(SKILLS_API_URL, {name: data.name}).then(function (response) {
            defer.resolve(response.data);
          }).catch(function(response) {
            if (response.status === 409) {
              growl.error('Skill ' + data.name + ' already exists');
            }
            console.error('There was a problem adding the skill.');
            defer.reject(new Error('There was a problem adding the skill.'));
          });
        }

        return defer.promise;
      },

      getBySlug: function(slug) {
        return this.list.then(function(skills) {
          return _.find(skills, function(skill) {
            return skill.slug === slug;
          });
        });
      }

    };
  });
