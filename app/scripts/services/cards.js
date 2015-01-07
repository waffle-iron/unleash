'use strict';

/**
 * @ngdoc service
 * @name unleashApp.cardsService
 * @description
 * # cardsService
 * Methods related to adding or removing user cards.
 */
angular.module('unleashApp')
  .factory('cardsService', function ($window, FBURL, $q, $firebase, templatesService) {
    var isInitialized = false;
    var currentUser = null;
    var cards = null;

    /**
     * Get rid of card properties other than type and level.
     * @param card
     * @returns {Object} A card only containing its type and level
     */
    var simplifyCard = function(card) {
      return _.pick(card, ['type', 'level']);
    };

    /**
     * Check if given card already exists in user cards
     * @param data
     * @returns {*}
     */
    var isCardIsAlreadyAdded = function(data) {
      var isAdded;

      var card = simplifyCard(data);

      if (_.find(cards, card)) {
        isAdded = true;
      }

      return isAdded;
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

        return new Promise(function (resolve, reject) {
          self.setup().then(function () {
            resolve(cards);
          }, function (error) {
            reject(error);
          });
        });
      },

      /**
       * Gets user cards and all initial card templates. Teturns templates that still can be used
       * @returns {Promise}
       */
      getAvailableTemplates: function() {
        var self = this;

        return new Promise(function (resolve) {
          var userCards = self.listCards();
          var templates = templatesService.list;

          var updateTemplates = new Promise(function(resolve, reject) {

            $q.all([userCards, templates]).then(function(arr) {
              var filtered = filterTemplates(arr[0], arr[1]);

              resolve(filtered);
            }).catch(function(error) {
              reject(error);
            });
          });

          resolve(updateTemplates);

          // If the list of cards has changed, render available templates again
          cards.$watch(function() {
            $q.all([userCards, templates]).then(function(arr) {
              var filtered = filterTemplates(arr[0], arr[1]);

              resolve(filtered);
            });
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
        return $q(function(resolve, reject) {
          card.achieved = !card.achieved;

          card.$save().then(function() {
            resolve();
          }, function(error) {
            reject(error);
          });
        });
      }
    };
  });
