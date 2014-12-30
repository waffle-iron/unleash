'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:templateEdit
 * @description
 * # templateEdit
 */
angular.module('unleashApp')
  .directive('unleashTemplateEdit', function (cardsService) {
    var save = function(data) {
      console.log(data);
    };

    return {
      templateUrl: 'views/partials/templateEdit.html',
      link: function postLink(scope, element, attrs) {
        scope.save = function(card) {
          save(card);
        };
      },
      scope: {
        card: '=',
        cards: '='
      }
    };
  });
