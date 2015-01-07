'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashCard
 * @description
 * # Displays a card
 */
angular.module('unleashApp')
  .directive('unleashCard', function($compile) {
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
        .attr('data-card-owner-id', scope.cardOwnerId)
        .attr('data-username', scope.username)
        .attr('data-card-id', scope.card.$id);

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

    var closeSidebar = function() {
      angular.element(document.body).removeClass('has-menu');

      setTimeout(function() {
        angular.element('.achievement').remove();
      }, 250);
    };

    var linkFn = function(scope, element, attr) {
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
        username: '@'
      },
      replace: true,
      link: linkFn
    };
  });
