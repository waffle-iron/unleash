'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:templateEdit
 * @description
 * # templateEdit
 */
angular.module('unleashApp')
  .directive('unleashTemplateEdit', function (cardsService) {
    var save = function(scope, card, eq) {
      cardsService.save(card).then(function() {
        cardsService.newCards.splice(eq, 1);
        scope.$apply();
      }, function(error) {
        console.error(error);
      });
    };

    var remove = function(eq) {
      cardsService.remove(eq);
    };

    return {
      templateUrl: 'views/partials/templateEdit.html',
      link: function postLink(scope, element, attrs) {
        scope.save = function(card) {
          save(scope, card, attrs.eq);
        };

        scope.remove = function() {
          remove(attrs.eq);
        };
      },
      scope: {
        card: '=',
        cards: '='
      }
    };
  });
