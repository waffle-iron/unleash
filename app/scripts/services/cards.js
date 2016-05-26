'use strict';

/**
 * @ngdoc service
 * @name unleashApp.cardsService
 * @description
 * # cardsService
 * Methods related to adding or removing user cards.
 */
angular.module('unleashApp')
  .factory('cardsService', function ($q, $http, PATHS_API_URL) {
    var cards = null;

    var moveCard = function (cardOwnerId, card, index) {
      var defer = $q.defer();

      $http.put(
        PATHS_API_URL + '/' + cardOwnerId + '/goals/' + card.id,
        {
          order: index
        }
      ).then(function(response) {
        card.order = index;
        defer.resolve(response.data.goals);
      }).catch(function() {
        console.error('There was a problem moving the cards.');
        defer.reject(new Error('There was a problem moving the cards.'));
      });

      return defer.promise;
    };

    var cardsService = {

      getCard: function(cardOwnerId, cardId) {
        var card = null;
        cards.map(function(cachedCard) {
          if (cachedCard.id === cardId) {
            card = cachedCard;
            if (card.unread) {
              cardsService.update(cardOwnerId, card.id, {unread: 0});
            }
          }
        });

        return card;
      },

      /**
       * List user cards
       * @returns {Promise} Promise containing user cards
       */
      listCards: function(uid) {
        var defer = $q.defer();

        $http.get(PATHS_API_URL + '/' + uid).then(function(response) {
            cards = response.data.goals;
            defer.resolve(response.data.goals);
        }).catch(function() {
          console.error('There was a problem loading cards.');
          defer.reject(new Error('There was a problem loading cards.'));
        });

        return defer.promise;
      },

      /**
       * Assign a given template as a card to the user
       * @param card
       */
      addFromTemplate: function(cardOwnerId, template) {
        var card = {
          name: template.name,
          description: template.description,
          level: template.level,
          icon: template.icon,
          order: template.order
        };

        return this.add(cardOwnerId, card);
      },

      /**
       * Assign a given card to the user
       * @param card
       */
      add: function(cardOwnerId, card) {

        // Update card order
        if (card.order <= cards.length) {
          cardsService.reorder(cardOwnerId, card.order);
        }

        var defer = $q.defer();

        $http.post(
          PATHS_API_URL + '/' + cardOwnerId + '/goals',
          card
        ).then(function(response) {
            defer.resolve(response.data.goals);
        }).catch(function() {
          console.error('There was a problem adding the card.');
          defer.reject(new Error('There was a problem adding the card.'));
        });

        return defer.promise;
      },

      /**
       * Remove the given card from user cards
       * @param _card
       */
      remove: function(cardOwnerId, _card) {
        var defer = $q.defer();
        $http.delete(
          PATHS_API_URL + '/' + cardOwnerId + '/goals/' + _card.id
        ).then(function() {
          angular.forEach(cards, function(card, i) {
            if (card.order > _card.order) {
              cardsService.moveLeft(cardOwnerId, card);
            }
            if (card.id === _card.id) {
              cards.splice(i, 1);
            }
          });
          defer.resolve(cards);
        }).catch(function() {
          console.error('There was a problem removing the card.');
          defer.reject(new Error('There was a problem removing the card.'));
        });

        return defer.promise;
      },

      update: function(cardOwnerId, id, data) {
        var defer = $q.defer();
        $http.put(
          PATHS_API_URL + '/' + cardOwnerId + '/goals/' + id,
          data
        ).then(function(response) {
          defer.resolve(response.data);
        })
        .catch(function() {
          console.error('There was a problem updating the card.');
          defer.reject(new Error('There was a problem updating the card.'));
        });

        return defer.promise;
      },

      /**
       *  Updates due date and clears the list
       *  of already sent notifications,
       *  so that they can be triggered again
       */
      updateDueDate: function(cardOwnerId, id, data) {
        return cardsService.update(cardOwnerId, id, {dueDate: data});
      },

      /**
       * Reorder cards when adding a new card
       * @param index - index to start with
       */
      reorder: function(cardOwnerId, index) {
        angular.forEach(cards, function(card) {
          if (card.order >= index) {
            cardsService.moveRight(cardOwnerId, card);
          }
        });
      },

      moveRight: function (cardOwnerId, card) {
        moveCard(cardOwnerId, card, card.order + 1).then(function() {
          // do nothing
        });
      },
      moveLeft: function (cardOwnerId, card) {
        moveCard(cardOwnerId, card, card.order - 1).then(function() {
          // do nothing
        });
      },

      /**
       * Move existing cards, change their order
       * @param _card {Object} card that was moved
       * @param index new index of moved card
       */
      move: function(cardOwnerId, _card, index) {
        if (_card.order !== index) {
          // When decreasing the card order
          if (_card.order > index) {
            index = index + 1;
          }
          angular.forEach(cards, function(card) {
            if (card.order > _card.order && card.order <= index) {
              cardsService.moveLeft(cardOwnerId, card);
            } else if (card.order < _card.order && card.order >= index) {
              cardsService.moveRight(cardOwnerId, card);
            }
          });
          // Finally, update the order of changed card
          return moveCard(cardOwnerId, _card, index);
        }
      },

      toggleAchieved: function(cardOwnerId, card) {
        return cardsService.update(cardOwnerId, card.id, {achieved: !card.achieved}).then(function() {
          card.achieved = !card.achieved;
        });
      }
    };

    return cardsService;
  });
