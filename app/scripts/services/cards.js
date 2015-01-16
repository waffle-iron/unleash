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
       * Pulls card details
       * If logged in user is an owner of the card, reset the unread count
       * @param data An object containing owner ID, current user ID and card ID
       * @returns {*} Card details
       */
      getCard: function(data) {
        var ref = new $window.Firebase(FBURL).child('users').child(data.ownerId).child('cards').child(data.cardId);
        var sync = $firebase(ref);

        var card = sync.$asObject();

        card.$loaded().then(function() {
          if (data.ownerId === data.userId) {
            card.unread = 0;
            card.$save();
          }
        });

        return sync.$asObject();
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
        return $q(function(resolve) {
          card.achieved = !card.achieved;

          card.$save().then(function() {
            resolve(card.achieved);
          });
        });
      },

      /**
       * Iterate an amount of unread comments
       * @param ref Firebase reference to the comment
       */
      iterateCommentCount: function(ref) {
        var card = $firebase(ref.parent().parent()).$asObject();

        card.$loaded().then(function() {
          if (!card.unread) {
            card.unread = 1;
          }

          else {
            card.unread++;
          }

          card.$save();
        });
      }
    };
  });
