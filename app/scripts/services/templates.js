'use strict';

/**
 * @ngdoc service
 * @name unleashApp.templatesService
 * @description
 * # templatesService
 * Methods related to adding or removing user templates.
 */
angular.module('unleashApp')
  .factory('templatesService', function($window, $q, FBURL, $firebase) {
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
      }
    };
  });

