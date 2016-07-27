'use strict';
/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashCardsAdd
 * @description
 * # unleashCardAdd
 */
angular.module('unleashApp')
  .directive('unleashCardsAdd', function () {
    return {
      templateUrl: 'views/partials/cardsAdd.html',
      scope: true,
      link: function postLink(scope) {
        scope.add = function(card) {
          var path = card.path;
          card.order = 1;
          if (path.goals) {
            card.order = path.goals.length + 1;
          }

          scope.addCard(card, path.id).then(function () {
            scope.$parent.newCards.splice(scope.$parent.newCards.indexOf(card), 1);
          });
        };

        scope.remove = function(eq) {
          scope.$parent.newCards.splice(eq, 1);
        };

        scope.update = function(card) {
          scope.$parent.updateCard(card).then(function() {
            scope.$parent.newCards.splice(scope.$parent.newCards.indexOf(card), 1);
          });
        };

        scope.create = function() {
          if (!scope.$parent.newCards) {
            scope.$parent.newCards = [];
          }
          scope.$parent.newCards.push({path: scope.paths[0]});
        };
      }
    };
  });
