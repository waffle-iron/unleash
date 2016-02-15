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
       * @param data Resource data
       * @returns {Promise}
       */
      add: function(data) {
        var defer = $q.defer();

        if (!data || !data.url || !data.skill) {
          defer.reject(new Error('No resource data given.'));
        } else {
          var resource = {
            'url': data.url,
            'skill': data.skill,
            'description': data.description || ''
          };

          resourceList.$add(resource).then(function () {
            defer.resolve();
          });
        }

        return defer.promise;
      }
    };
  });
