'use strict';

/**
 * @ngdoc service
 * @name unleashApp.templatesService
 * @description
 * # templatesService
 * Methods related to adding or removing user templates.
 */
angular.module('unleashApp')
  .factory('templatesService', function($window, $q, FBURL, $firebase, cardsService) {
    var ref = new $window.Firebase(FBURL).child('templates');
    var templates = {};

    templates.new = [];

    templates.stored = $firebase(ref);

    templates.initial = [
      {
        'type': 'Blogging',
        'level': 1,
        'task': 'Start tracking ideas'
      },
      {
        'type': 'Meetup Attender',
        'task': 'Attend at least 1 meeting'
      },
      {
        'type': 'Meetup Speaker',
        'task': 'Speak at a meetup'
      },
      {
        'type': 'Conference Speaker',
        'task': 'Speak at a conference'
      },
      {
        'type': 'Open Source Contributor',
        'task': 'Contribute to an Open Source project'
      },
      {
        'type': 'Proactive',
        'level': 1
      },
      {
        'type': 'Mentoring',
        'level': 1
      },
      {
        'type': 'Leadership',
        'level': 1
      },
      {
        'type': 'Open Source Advocate',
        'level': 1
      }
    ];

    /**
     * Populate a predefined set of templates to the database
     * @param data
     * @returns {Promise}
     */
    var populateTemplates = function(data) {
      return new Promise(function(resolve, reject) {
        templates.stored.$set(data).then(function() {
          resolve(data);
        }, function(error) {
          reject(new Error(error));
        });
      });
    };

    /**
     * Get rid of card properties other than type and level.
     * @param card
     * @returns {Object} A card only containing its type and level
     */
    var simplifyCard = function(card) {
      return _.pick(card, ['type', 'level']);
    };

    /**
     * Removes templates that already have been used.
     * @param cards Cards currently assigned to the user
     * @param templates A current set of templates to use
     * @returns {Array} Templates that haven’t been used yet
     */
    var filterTemplates = function(cards, templates) {
      cards = cards.map(simplifyCard);
      templates = templates.map(simplifyCard);

      var unique = _.reject(templates, function(template) {
        var isEqual = false;

        _.forEach(cards, function(card) {
          if(_.isEqual(template, card)) {
            isEqual = true;
          }
        });

        return isEqual;
      });

      return unique;
    };

    return {
      /**
       * Synchronize new templates
       */
      newTemplates: templates.new,

      /**
       * List initial templates
       */
      list: $q(function(resolve, reject) {
        var list = templates.stored.$asArray();

        list.$loaded().then(function() {
          if (list.length) {
            resolve(list);
          }

          else {
            // No templates stored in Firebase, instantiate
            populateTemplates(templates.initial).then(function() {
              resolve(templates.initial);
            }, function(error) {
              reject(new Error(error));
            });
          }

        });
      }),

      /**
       * Add a new template
       * @param data
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
       * @param id
       * @param data
       * @returns {Promise}
       */
      update: function(id, data) {
        return $q(function(resolve, reject) {
          var template = $firebase(ref.child(id));

          template.$update(data).then(function() {
            resolve();
          }, function(error) {
            reject(error);
          });
        });
      },

      /**
       * Remove a given unsaved template
       * @param eq
       */
      removeNew: function(eq) {
        templates.new.splice(eq, 1);
      },

      /**
       * Remove given stored template
       * @param id
       * @returns {Promise}
       */
      removeStored: function(id) {
        return $q(function(resolve, reject) {
          var list = templates.stored.$asArray();
          var item = list.$getRecord(id);

          list.$remove(item).then(function() {
            resolve();
          }, function(error) {
            reject(error);
          });
        });
      },

      /**
       * Restore initial template templates
       */
      restore: function() {
        populateTemplates(templates.initial);
      },

      /**
       * Gets user cards and all initial card templates. Returns templates that still can be used
       * @returns {Promise}
       */
      getAvailableTemplates: function() {
        var self = this;

        return new Promise(function (resolve) {
          var userCards = cardsService.listCards();
          var templates = self.list;

          var updateTemplates = new Promise(function(resolve, reject) {

            $q.all([userCards, templates]).then(function(arr) {
              var filtered = filterTemplates(arr[0], arr[1]);

              resolve(filtered);
            }).catch(function(error) {
              reject(error);
            });
          });

          resolve(updateTemplates);
        });
      }
    };
  });

