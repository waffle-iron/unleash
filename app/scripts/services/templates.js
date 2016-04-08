'use strict';

/**
 * @ngdoc service
 * @name unleashApp.templatesService
 * @description
 * # templatesService
 * Methods related to adding or removing user templates.
 */
angular.module('unleashApp')
  .factory('templatesService', function($window, $q, $http, $firebaseArray, FBURL, cardsService, dataPath) {
    var ref = new $window.Firebase(FBURL).child('templates');
    var templateList = null;
    var templates = {};

    templates.new = [];

    templates.stored = ref.orderByChild('type');

    return {
      /**
       * Synchronize new templates
       */
      newTemplates: templates.new,

      list: $q(function(resolve, reject) {
          $http.get('http://goals.unleash.x-team.com/api/v1/goals').then(function(response) {
            resolve(response.data);
          }).catch(function() {
            console.error('There was a problem loading the templates.');
            reject(new Error('There was a problem loading the templates.'));
          });
      }),

      /**
       * Add a new template
       * @param data Template data
       * @returns {Promise}
       */
      add: function(data) {
        var defer = $q.defer();

        if (!data || !data.type) {
          defer.reject(new Error('No template data given.'));
        } else {
          var template = {
            'type': data.type,
            'task': data.task || '',
            'level': data.level || '',
            'icon': data.icon || ''
          };
          templateList.$add(template).then(function () {
            defer.resolve();
          });
        }

        return defer.promise;
      },

      /**
       * Update template details with new data
       * @param id Template ID
       * @param data New data
       * @returns {Promise} Resolved once data has been stored in Firebase
       */
      update: function(id, data, onComplete) {
        var template = ref.child(id);

        return template.update(data, onComplete);
      },

      /**
       * Remove a given unsaved template
       * @param eq
       */
      removeNew: function(eq) {
        templates.new.splice(eq, 1);
      },

      /**
       * Remove a given stored template
       * @param id ID of stored template
       * @returns {Promise}
       */
      removeStored: function(id) {
        var index = templateList.$indexFor(id);

        return templateList.$remove(index);
      }
    };
  });
