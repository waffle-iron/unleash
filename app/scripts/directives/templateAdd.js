'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:templateAdd
 * @description
 * # templateAdd
 */
angular.module('unleashApp')
  .directive('unleashTemplateAdd', function (cardsService) {
    var add = function(scope, card, eq) {
      cardsService.add(card).then(function() {
        cardsService.newCards.splice(eq, 1);
        scope.$apply();
      }, function(error) {
        console.error(error);
      });
    };

    var remove = function(eq) {
      cardsService.removeNew(eq);
    };

    return {
      templateUrl: 'views/partials/templateAdd.html',
      link: function postLink(scope, element, attrs) {
        scope.add = function(card) {
          add(scope, card, attrs.eq);
        };

        scope.remove = function() {
          remove(attrs.eq);
        };
      },
      scope: {
        card: '='
      }
    };
  });
