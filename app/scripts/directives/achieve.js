'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashAchieve
 * @description
 * # Renders the button for toggling achieved state in the card
 */
angular.module('unleashApp')
  .directive('unleashAchieve', function (cardsService, slackService) {
    return {
      link: function postLink(scope, element) {
        scope.slackNotification = false;
        scope.cardOwnerMessage = '';

        /**
         * Updates text in the button basing on whether the card has been achieved already.
         * @param isAchieved
         */

        var $button = angular.element(element.find('button'));

        var updateButton = function() {
          var newText = !scope.card.achieved ? 'Mark as achieved' : 'Mark as not achieved';

          $button.text(newText);
        };

        updateButton();

        scope.$watchCollection('card', function() {
          updateButton();
        });

        $button.on('click', function() {
          cardsService.toggleAchieved(scope.card)
            .then(function(achieved) {

              if (achieved && scope.slackNotification) {
                slackService.notifyAchieved({
                  cardOwner: scope.$parent.cardOwner,
                  currentUser: scope.$parent.currentUser,
                  card: scope.card
                });

                if (scope.cardOwnerMessage) {
                  slackService.notifyOwnerAchieved({
                    message: cardOwnerMessage,
                    cardOwner: scope.$parent.cardOwner,
                    currentUser: scope.$parent.currentUser
                  });
                }
              }
            });
        });

      },
      scope: true,
      replace: true,
      templateUrl: 'views/partials/achieve.html'
    };
  });
