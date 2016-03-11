'use strict';

/**
 * @ngdoc service
 * @name unleashApp.resourceService
 * @description
 * # resourceService
 * Methods related to adding or removing skill resources.
 */
angular.module('unleashApp')
  .factory('resourceService', function($window, $q, $http, $firebaseArray, FBURL) {
    var ref = new $window.Firebase(FBURL).child('resources');
    var resourceList = null;
    var resources = {};

    resources.stored = ref;

    return {
      listBySkill: function(skillId) {
        var defer = $q.defer();

        resourceList = $firebaseArray(ref.orderByChild('skill').equalTo(skillId));

        resourceList.$loaded().then(function() {
          defer.resolve(resourceList);
        });

        return defer.promise;
      },

      /**
       * List resources
       */
      list: $q(function(resolve) {
        resourceList = $firebaseArray(resources.stored);

        resourceList.$loaded().then(function() {
            resolve(resourceList);
        });
      }),

      /**
       * Add a new resource
       * @param resource
       * @param skillId
       * @returns {Promise}
       */
      add: function(resource, skillId) {
        var defer = $q.defer();

        if (!resource || !resource.url || !skillId) {
          defer.reject(new Error('No resource data given.'));
        } else {
          var data = {
            'url': resource.url,
            'skill': skillId,
            'description': resource.description || ''
          };

          resourceList.$add(data).then(function () {
            defer.resolve();
          });
        }

        return defer.promise;
      }
    };
  });
