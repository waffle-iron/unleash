'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashCard
 * @description
 * # Displays a card
 */
angular.module('unleashApp')
  .directive('unleashCard', function($compile, fbutil, cardsService, $window) {
    /**
     * Update the comment count and the indicator for new comments
     * @param scope Directive scope
     * @param card Current card
     */
    var updateCommentCount = function(scope, card) {
      scope.commentCount = _.size(card.comments);
      if (scope.cardOwnerId === scope.currentUserId) {
        scope.showUnread = !!card.unread;
      }
    };

    var linkFn = function(scope, element, attrs) {
      if (attrs.view === 'public' && scope.cardOwnerId) {
        var card = cardsService.getComments({
          ownerId: scope.cardOwnerId,
          cardId: scope.card.$id
        });

        card.$loaded().then(function () {
          updateCommentCount(scope, card);
        });

        scope.$watch('card.comments', function () {
          updateCommentCount(scope, card);
        });

        scope.daysLeft = function(date) {
          if (!date) {
            return 'no due date';
          }

          var dueDate = new $window.Date(date).getTime(), // Mockable instantiation
              now = $window.Date.now();

          return Math.floor(Math.max(0, (dueDate - now) / (24 * 3600 * 1000) ));
        };
      }
    };

    return {
      templateUrl: 'views/partials/card.html',
      scope: {
        card: '=',
        cardOwnerId: '@',
        currentUserId: '@'
      },
      replace: true,
      link: linkFn
    };
  });
