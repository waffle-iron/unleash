'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashAchieve
 * @description
 * # Renders the button for toggling achieved state in the card
 */
angular.module('unleashApp')
  .directive('unleashAchieve', function (cardsService) {
    return {
      link: function postLink(scope, element) {
        /**
         * Updates text in the button basing on whether the card has been achieved already.
         * @param isAchieved
         */
        var updateButton = function() {
          var newText = !scope.card.achieved ? 'Mark as achieved' : 'Mark as not achieved';

          element.text(newText);
        };

        updateButton();

        scope.card.$watch(function() {
          updateButton();
        });

        element.on('click', function() {
          if (scope.currentUser === scope.cardOwner) {
            cardsService.toggleAchieved(scope.card);
          }
        });

      },
      scope: true
    };
  });
