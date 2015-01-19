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
     * Check if a given card is already being viewed
     * @param id Card $id
     * @returns {boolean}
     */
    var isCardAlreadyOpened = function(id) {
      var currentId = angular.element('.achievement').attr('data-card-id');
      return id === currentId;
    };

    /**
     * Create a new directive and add it to the scope
     * @param scope
     */
    var showCardDetails = function(scope) {
      var $body = angular.element(document.body);

      // Create sidebar element
      var $sidebar = angular.element('<unleash-card-details></unleash-card-details>')
        .attr('data-card-owner-id', scope.cardOwnerId || '')
        .attr('data-current-user-id', scope.currentUserId || '')
        .attr('data-card-id', scope.card.$id || '');

      // Hide the existing sidebar, if any
      closeSidebar();

      // Add a new sidebar
      setTimeout(function() {
        $body
          .append($compile($sidebar)(scope));

        setTimeout(function() {
          $body.addClass('has-menu');
        }, 10);
      }, 250);
    };

    /**
     * Closes all existing sidebars
     */
    var closeSidebar = function() {
      angular.element(document.body).removeClass('has-menu');

      setTimeout(function() {
        angular.element('.achievement').remove();
      }, 250);
    };

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

    var linkFn = function(scope, element, attr) {
      scope.$watch('cardOwnerId', function(data) {
        if(data) {
          updateCommentCount(scope);
        }
      });

      if(attr.view === 'public') {
        element.on('click', function() {
          if (isCardAlreadyOpened(scope.card.$id)) {
            closeSidebar();
          } else {
            showCardDetails(scope);
          }
        });
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
