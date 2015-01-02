'use strict';

var cardsService = angular.module('unleashApp.cardsService', ['firebase']);

cardsService.factory('cardsService', ['$window', 'FBURL', '$firebase', function($window, FBURL, $firebase) {
  var ref = new $window.Firebase(FBURL).child('cards');
  var cards = {};

  cards.new = [];

  cards.stored = $firebase(ref);

  cards.initial = [
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
   * Populate a predefined set of cards to database
   * @param data
   * @returns {Promise}
   */
  var populateCards = function(data) {
    return new Promise(function(resolve, reject) {
      cards.stored.$set(data).then(function() {
        resolve(data);
      }, function(error) {
        reject(new Error(error));
      });
    });
  };

  return {
    /**
     * Synchronize new cards
     */
    newCards: cards.new,

    /**
     * List initial cards
     */
    list: new Promise(function(resolve, reject) {
      var list = cards.stored.$asArray();

      list.$loaded().then(function() {
        if (list.length) {
          resolve(list);
        }

        else {
          // No cards stored in Firebase, instantiate
          populateCards(cards.initial).then(function() {
            resolve(cards.initial);
          }, function(error) {
            reject(new Error(error));
          });
        }

      });
    }),

    /**
     * Add a new card
     * @param data
     * @returns {Promise}
     */
    add: function(data) {
      return new Promise(function(resolve, reject) {
        if (!data || !data.type) {
          reject(new Error('No card data given.'));
        }

        else {
          var card = {
            'type': data.type,
            'task': data.task || '',
            'level': data.level || ''
          };

          cards.stored.$push(card).then(function(ref) {
            resolve(ref.key());
          }, function(error) {
            reject(error);
          });
        }
      });
    },

    /**
     * Update card details with new data
     * @param id
     * @param data
     * @returns {Promise}
     */
    update: function(id, data) {
      return new Promise(function(resolve, reject) {
        var card = $firebase(ref.child(id));

        card.$update(data).then(function() {
          resolve();
        }, function(error) {
          reject(error);
        });
      });
    },

    /**
     * Mark card as completed.
     * @param card
     * @returns {Promise}
     */
    markAsAchieved: function(card) {
      return new Promise(function(resolve, reject) {
        card.achieved = true;

        card.$save().then(function() {
          resolve();
        }, function(error) {
          reject(error);
        });
      });
    },

    /**
     * Remove given template card
     * @param eq
     */
    removeNew: function(eq) {
      cards.new.splice(eq, 1);
    },

    /**
     * Remove given stored card
     * @param id
     * @returns {Promise}
     */
    removeStored: function(id) {
      return new Promise(function(resolve, reject) {
        var list = cards.stored.$asArray();
        var item = list.$getRecord(id);

        list.$remove(item).then(function() {
          resolve();
        }, function(error) {
          reject(error);
        });
      });
    },

    /**
     * Restore initial template cards
     */
    restore: function() {
      populateCards(cards.initial);
    },

    /**
     * Close sidebar and remove achievement from DOM
     */
    closeSidebar: function() {
      angular.element(document.body).removeClass('has-menu');

      setTimeout(function() {
        angular.element('.achievement').remove();
      }, 250);
    }
  };
}]);
