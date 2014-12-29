'use strict';

angular.module('unleashApp').directive('unleashCard', function($compile) {
  var showCardDetails = function(scope) {
    var $body = angular.element(document.body);

    // Create sidebar element
    var $sidebar = angular.element('<unleash-card-details></unleash-card-details>')
      .attr('card-owner-id', scope.cardOwnerId)
      .attr('username', scope.username)
      .attr('card-id', scope.cardId);

    // If exists, hide existing sidebar
    $body.removeClass('has-menu');

    // Remove rendered sidebar directive from DOM
    angular.element('.achievement').remove();

    // Add new sidebar
    $body
      .append($compile($sidebar)(scope))
      .addClass('has-menu');

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
