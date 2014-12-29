'use strict';

angular.module('unleashApp').directive('unleashCard', function($compile, cardsService) {
  var showCardDetails = function(scope) {
    var $body = angular.element(document.body);

    // Create sidebar element
    var $sidebar = angular.element('<unleash-card-details></unleash-card-details>')
      .attr('card-owner-id', scope.cardOwnerId)
      .attr('username', scope.username)
      .attr('card-id', scope.cardId);

    // Hide the existing sidebar, if any
    cardsService.closeSidebar();

    // Add a new sidebar
    setTimeout(function() {
      $body
        .append($compile($sidebar)(scope));

      setTimeout(function() {
        $body.addClass('has-menu');
      }, 10);
    }, 250);

  };

  var linkFn = function(scope) {
    scope.showCardDetails = function() {
      if(!scope.isDraggable) {
        showCardDetails(scope);
      }
    };
  };

  return {
    templateUrl: 'views/partials/card.html',
    scope: {
      card: '=cardData',
      cardOwnerId: '@',
      username: '@',
      cardId: '@',
      isDraggable: '@'
    },
    replace: true,
    link: linkFn
  };
});
