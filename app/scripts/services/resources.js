'use strict';

/**
 * @ngdoc service
 * @name unleashApp.resourceService
 * @description
 * # resourceService
 * Methods related to adding or removing skill resources.
 */
angular.module('unleashApp')
  .factory('resourceService', function($q, $http, SKILLS_API_URL) {

    return {
      listBySkill: function(slug) {
        var defer = $q.defer();

        $http.get(SKILLS_API_URL + '/' + slug).then(function(response) {
          defer.resolve(response.data.resources);
        }).catch(function() {
          console.error('There was a problem loading the resources.');
          defer.reject(new Error('There was a problem loading the resources.'));
        });

        return defer.promise;
      },

      add: function(resource, slug) {
        var defer = $q.defer();

        $http.post(SKILLS_API_URL + '/' + slug + '/resources', {
          url: resource.url,
          description: resource.description || ''
        }).then(function(response) {
          defer.resolve(response.data.resources);
        }).catch(function() {
          console.error('There was a problem adding the resources.');
          defer.reject(new Error('There was a problem adding the resources.'));
        });

        return defer.promise;
      }
    };
  });
