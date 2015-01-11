'use strict';

/**
 * @ngdoc service
 * @name unleashApp.cardsService
 * @description
 * # cardsService
 * Methods related to adding or removing user cards.
 */
angular.module('unleashApp')
  .factory('cardsService', function ($window, FBURL, $q, $firebase) {
    var isInitialized = false;
    var currentUser = null;
    var cards = null;

    /**
     * Check if given card already exists in user cards
     * @param data Card object
     * @returns {boolean}
     */
    var isCardIsAlreadyAdded = function(data) {
      return _.find(cards, { type: data.type, level: data.level }) ? true : false;
    };

    return {
      /**
       * Setup service with basic user data and download user cards
       * @param uid
       * @returns {Promise} Resolve if cards have finished fetching
       */
      setup: function(uid) {
        return new Promise(function(resolve, reject) {
          // If uid is present, setup the service
          if (uid) {
            var ref = new $window.Firebase(FBURL).child('users').child(uid).child('cards');
            cards = $firebase(ref).$asArray();

            isInitialized = true;
            currentUser = uid;

            cards.$loaded().then(function() {
              resolve();
            });
          }

          // If setup setter hasn’t been called yet
          else if (!uid && !isInitialized) {
            reject(new Error('You need to setup cardsService first!'));
          }

          cards.$loaded().then(function() {
            resolve();
          });
        });
      },

      /**
       * List user cards
       * @returns {*}
       */
      listCards: function() {
        var self = this;

        return $q(function (resolve, reject) {
          self.setup().then(function () {
            resolve(cards);
          }, function (error) {
            reject(error);
          });
        });
      },

      /**
       * Assign a given card to the user
       * @param card
       */
      add: function(card) {
        // Check if the UID is set
        if (!currentUser) {
          console.error('No user UID set!');
          return;
        }

        // Abandon if the card has been added already
        if (isCardIsAlreadyAdded(card)) {
          return;
        }

        // If all works OK
        cards.$add(card);
      },

      /**
       * Remove the given card from user cards
       * @param card
       */
      remove: function(card) {
        cards.$remove(card);
      },

      /**
       * Toggle 'achieved' state in the card
       * @param card
       * @returns {Promise} Resolved after the updated card has been stored in Firebase.
       */
      toggleAchieved: function(card) {
        card.achieved = !card.achieved;

        return card.$save();
      }
    };
  });
