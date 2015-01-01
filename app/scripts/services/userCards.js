'use strict';

/**
 * @ngdoc service
 * @name unleashApp.userCards
 * @description
 * # userCards
 * Methods related to adding or removing user cards.
 */
angular.module('unleashApp')
  .factory('userCards', function ($window, FBURL, $firebase) {
    var currentUser;
    var cards;

    /**
     * Check if given card already exists in user cards
     * @param data
     * @returns {*}
     */
    var checkIfCardIsAlreadyAdded = function(data) {
      var isAdded;

      var card = _.pick(data, ['type', 'level']);

      if (_.find(cards, card)) {
        isAdded = true;
      }

      return isAdded;
    };

    return {
      /**
       * Setup service with basic user data and download user cards
       * @param uid
       * @returns Promise
       */
      setup: function(uid) {
        var ref = new $window.Firebase(FBURL).child('users').child(uid).child('cards');
        cards = $firebase(ref).$asArray();

        currentUser = uid;

        return cards.$loaded();
      },

      /**
       * List user cards
       * @returns {*}
       */
      list: function() {
        return cards;
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
        if (checkIfCardIsAlreadyAdded(card)) {
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
      }
    };
  });
