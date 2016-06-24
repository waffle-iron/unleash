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
    var cachedPaths = [];

    var moveCard = function (pathId, card, index) {
      var defer = $q.defer();

      $http.put(
        PATHS_API_URL + '/' + pathId + '/goals/' + card.id,
        {
          order: index
        }
      ).then(function(response) {
        card.order = index;
        cachedPaths[response.data.id] = response.data;

        defer.resolve(cachedPathsToArray());
      }).catch(function() {
        console.error('There was a problem moving the cards.');
        defer.reject(new Error('There was a problem moving the cards.'));
      });

      return defer.promise;
    };

    var cachePaths = function(paths) {
      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        cachedPaths[path.id] = path;
      }
    };

    var cachedPathsToArray = function() {
      var result = [];
      for (var id in cachedPaths) {
        result.push(cachedPaths[id]);
      }

      return result;
    };

    var cardsService = {

      getCard: function(pathId, cardId) {
        var card = null;
        angular.forEach(cachedPaths[pathId].goals, function(cachedCard) {
          if (cachedCard.id === cardId) {
            card = cachedCard;
            if (card.unread) {
              cardsService.update(pathId, card.id, {unread: 0});
            }
          }
        });

        return card;
      },

      listPaths: function(userId) {
        var defer = $q.defer();

        $http.get(PATHS_API_URL + '?userId=' + userId).then(function(response) {
          cachePaths(response.data);
          defer.resolve(response.data);
        }).catch(function() {
          console.error('There was a problem loading paths.');
          defer.reject(new Error('There was a problem loading paths.'));
        });

        return defer.promise;
      },

      createPath: function(userId) {
        var defer = $q.defer();

        $http.post(
          PATHS_API_URL,
          {
            userId: userId
          }
        ).then(function(response) {
          cachePaths(response.data);
          defer.resolve(response.data);
        }).catch(function() {
          console.error('There was a problem creating the path.');
          defer.reject(new Error('There was a problem creating the path.'));
        });

        return defer.promise;
      },

      updatePath: function(pathId, data) {
        var defer = $q.defer();

        $http.put(
          PATHS_API_URL + '/' + pathId,
          data
        ).then(function() {
          defer.resolve();
        }).catch(function() {
          console.error('There was a problem updating the path.');
          defer.reject(new Error('There was a problem updating the path.'));
        });

        return defer.promise;
      },

      /**
       * Assign a given template as a card to the user
       * @param pathId
       * @param template
       */
      addFromTemplate: function(pathId, template) {
        var card = {
          name: template.name,
          description: template.description,
          level: template.level,
          icon: template.icon,
          order: template.order
        };

        return this.add(pathId, card);
      },

      /**
       * Assign a given card to the user
       * @param pathId
       * @param card
       */
      add: function(pathId, card) {

        // Update card order
        if (card.order <= cachedPaths[pathId].goals.length) {
          cardsService.reorder(pathId, card.order);
        }

        var defer = $q.defer();

        $http.post(
          PATHS_API_URL + '/' + pathId + '/goals',
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
       * Remove a card from a path
       * @param pathId
       * @param _card
       */
      remove: function(pathId, _card) {
        var defer = $q.defer();
        $http.delete(
          PATHS_API_URL + '/' + pathId + '/goals/' + _card.id
        ).then(function() {
          angular.forEach(cachedPaths[pathId].goals, function(goal, i) {
            if (goal.order > _card.order) {
              cardsService.moveLeft(pathId, goal);
            }
            if (goal.id === _card.id) {
              cachedPaths[pathId].goals.splice(i, 1);
            }
          });

          defer.resolve(cachedPathsToArray());
        }).catch(function() {
          console.error('There was a problem removing the card.');
          defer.reject(new Error('There was a problem removing the card.'));
        });

        return defer.promise;
      },

      update: function(pathId, id, data) {
        var defer = $q.defer();
        $http.put(
          PATHS_API_URL + '/' + pathId + '/goals/' + id,
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
      updateDueDate: function(pathId, id, data) {
        return cardsService.update(pathId, id, {dueDate: data});
      },

      /**
       * Reorder cards when adding a new card
       * @param pathId
       * @param index - index to start with
       */
      reorder: function(pathId, index) {
        angular.forEach(cachedPaths[pathId].goals, function(card) {
          if (card.order >= index) {
            cardsService.moveRight(pathId, card);
          }
        });
      },

      moveRight: function (pathId, card) {
        moveCard(pathId, card, card.order + 1).then(function() {
          // do nothing
        });
      },
      moveLeft: function (pathId, card) {
        moveCard(pathId, card, card.order - 1).then(function() {
          // do nothing
        });
      },

      /**
       * Move existing cards, change their order
       * @param pathId
       * @param _card {Object} card that was moved
       * @param index new index of moved card
       */
      move: function(pathId, _card, index) {
        if (_card.order !== index) {
          // When decreasing the card order
          if (_card.order > index) {
            index = index + 1;
          }
          angular.forEach(cachedPaths[pathId].goals, function(card) {
            if (card.order > _card.order && card.order <= index) {
              cardsService.moveLeft(pathId, card);
            } else if (card.order < _card.order && card.order >= index) {
              cardsService.moveRight(pathId, card);
            }
          });
          // Finally, update the order of changed card
          return moveCard(pathId, _card, index);
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
