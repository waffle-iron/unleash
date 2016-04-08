'use strict';

/**
 * @ngdoc service
 * @name unleashApp.templatesService
 * @description
 * # templatesService
 * Methods related to adding or removing user templates.
 */
angular.module('unleashApp')
  .factory('templatesService', function($window, $q, $http, $firebaseArray, FBURL, cardsService, dataPath, GOALS_API_URL) {
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
          $http.get(GOALS_API_URL).then(function(response) {
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

        if (!data || !data.name || !data.description) {
          defer.reject(new Error('No template data given.'));
        } else {
          var template = {
            'name': data.name,
            'description': data.description,
            'level': data.level || '',
            'icon': data.icon || ''
          };

          $http.post(GOALS_API_URL, template).then(function (response) {
            defer.resolve(response.data);
          }).catch(function(response) {
            console.error('There was a problem adding the template.');
            defer.reject(new Error('There was a problem adding the template.'));
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
