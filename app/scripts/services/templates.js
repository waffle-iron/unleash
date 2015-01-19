'use strict';

/**
 * @ngdoc service
 * @name unleashApp.templatesService
 * @description
 * # templatesService
 * Methods related to adding or removing user templates.
 */
angular.module('unleashApp')
  .factory('templatesService', function($window, $q, $http, FBURL, $firebase, cardsService, dataPath) {
    var ref = new $window.Firebase(FBURL).child('templates');
    var templates = {};

    templates.new = [];

    templates.stored = $firebase(ref.orderByChild('type'));

    /**
     * Populate a predefined set of templates to the database
     * @returns {Promise} A reference to the Firebase object
     */
    var populateTemplates = function() {
      return $q(function() {
        $http.get(dataPath + 'templates.json').then(function(obj) {
          return templates.stored.$set(obj.data);
        }).catch(function() {
          console.error('There was a problem loading the templates data file.');
        });
      });
    };

    /**
     * Removes templates that have been used already.
     * @param cards Cards currently assigned to the user
     * @param templates A current set of templates to use
     * @returns {Array} Templates that haven’t been used yet
     */
    var filterTemplates = function(cards, templates) {

      // Find templates that already match an existing card
      var matchesAnyCard = function(template) {
        return _.some(cards, function(card) {

          // Compare a card to the given template
          return _.isEqual(template, card, function(a, b) {
            return a.type === b.type && a.level === b.level;
          });

        });
      };

      return _.reject(templates, matchesAnyCard);
    };

    return {
      /**
       * Synchronize new templates
       */
      newTemplates: templates.new,

      /**
       * List initial templates
       */
      list: $q(function(resolve) {
        var list = templates.stored.$asArray();

        list.$loaded().then(function() {
          if (list.length) {
            resolve(list);
          }

          else {
            // No templates stored in Firebase, instantiate
            return populateTemplates();
          }

        });
      }),

      /**
       * Add a new template
       * @param data Template data
       * @returns {Promise}
       */
      add: function(data) {
        return $q(function(resolve, reject) {
          if (!data || !data.type) {
            reject(new Error('No template data given.'));
          }

          else {
            var template = {
              'type': data.type,
              'task': data.task || '',
              'level': data.level || ''
            };

            templates.stored.$push(template).then(function(ref) {
              resolve(ref.key());
            }, function(error) {
              reject(error);
            });
          }
        });
      },

      /**
       * Update template details with new data
       * @param id Template ID
       * @param data New data
       * @returns {Promise} Resolved once data has been stored in Firebase
       */
      update: function(id, data) {
        var template = $firebase(ref.child(id));

        return template.$update(data);
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
        var list = templates.stored.$asArray();
        var item = list.$getRecord(id);

        return list.$remove(item);
      },

      /**
       * Gets user cards and all initial card templates. Returns templates that still can be used
       * @returns {Promise}
       */
      getAvailableTemplates: function(uid) {
        var self = this;

        return new Promise(function (resolve) {
          var userCards = cardsService.listCards(uid);
          var templates = self.list;

          var availableTemplates = $q(function(resolve, reject) {

            $q.all([userCards, templates]).then(function(arr) {
              var filtered = filterTemplates(arr[0], arr[1]);

              resolve(filtered);
            }).catch(function(error) {
              reject(error);
            });
          });

          resolve(availableTemplates);
        });
      }
    };
  });

