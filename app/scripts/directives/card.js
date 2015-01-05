'use strict';

angular.module('unleashApp').directive('unleashCard', function($compile, cardsService) {
  var showCardDetails = function(scope) {
    var $body = angular.element(document.body);

    // Create sidebar element
    var $sidebar = angular.element('<unleash-card-details></unleash-card-details>')
      .attr('data-card-owner-id', scope.cardOwnerId)
      .attr('data-username', scope.username)
      .attr('data-card-id', scope.card.$id);

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

  var linkFn = function(scope, element, attr) {
    /**
     * Check if a given card is already being viewed
     * @param id Card $id
     * @returns {boolean}
     */
    var isCardAlreadyOpened = function(id) {
      var currentId = angular.element('.achievement').attr('data-card-id');
      return id === currentId;
    };

    if(attr.view === 'public') {
      element.on('click', function() {
        if (isCardAlreadyOpened(scope.card.$id)) {
          cardsService.closeSidebar();
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
      username: '@'
    },
    replace: true,
    link: linkFn
  };
});
