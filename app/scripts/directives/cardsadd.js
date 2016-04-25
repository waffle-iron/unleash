'use strict';
/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashCardsAdd
 * @description
 * # unleashCardAdd
 */
angular.module('unleashApp')
  .directive('unleashCardsAdd', function (cardsService) {

    var add = function(scope, card) {
      cardsService.add(scope.currentUser, card).then(function(cards) {
        scope.newCards.splice(scope.newCards.indexOf(card), 1);
        scope.$parent.cards = cards;
      }, function() {
        delete card.order;
      });
    };

    var remove = function(scope, eq) {
      scope.newCards.splice(eq, 1);
    };

    var create = function(scope) {
      scope.newCards.push({});
    };

    return {
      templateUrl: 'views/partials/cardsAdd.html',
      scope: true,
      link: function postLink(scope) {
        scope.newCards = [];

        scope.add = function(card) {
          card.order = (scope.$parent.cards.length + 1) || 1;
          add(scope, card);
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
