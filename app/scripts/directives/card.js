'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashCard
 * @description
 * # Displays a card
 */
angular.module('unleashApp')
  .directive('unleashCard', function($compile, fbutil, cardsService) {
    /**
     * Update the comment count and the indicator for new comments
     * @param scope Directive scope
     */
    var updateCommentCount = function(scope) {
      cardsService.getComments({
        ownerId: scope.cardOwnerId,
        cardId: scope.card.$id
      }).then(function(card) {
        scope.commentCount = _.size(card.comments);
        if (scope.cardOwnerId === scope.currentUserId) {
          scope.showUnread = !!card.unread;
        }
      });
    };

    var linkFn = function(scope) {
      scope.$watch('cardOwnerId', function(data) {
        if(data) {
          updateCommentCount(scope);
        }
      });
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
