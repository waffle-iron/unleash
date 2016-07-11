'use strict';
/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashCardsAdd
 * @description
 * # unleashCardAdd
 */
angular.module('unleashApp')
  .directive('unleashCardsAdd', function () {

    var remove = function(scope, eq) {
      scope.newCards.splice(eq, 1);
    };

    var create = function(scope) {
      scope.newCards.push({path: scope.paths[0]});
    };

    return {
      templateUrl: 'views/partials/cardsAdd.html',
      scope: true,
      link: function postLink(scope) {
        scope.newCards = [];

        scope.add = function(card) {
          var path = card.path;
          card.order = 1;
          if (path.goals) {
            card.order = path.goals.length + 1;
          }

          scope.addCard(card, path.id).then(function () {
            scope.newCards.splice(scope.newCards.indexOf(card), 1);
          });
        };

        scope.remove = function(eq) {
          remove(scope, eq);
        };

        scope.create = function() {
          create(scope);
        };
      }
    };
  });
