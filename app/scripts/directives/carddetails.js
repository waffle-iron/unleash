'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashCardDetails
 * @description
 * # Renders card details
 */
angular.module('unleashApp')
  .directive('unleashCardDetails', function($rootScope, $compile, growl, userService, cardsService, commentsService) {
    /**
     * Renders a button for toggling the 'achieved' state in the card
     */
    var addAchievedButton = function($scope) {
      if (!$scope.cardOwner || $scope.currentUser !== $scope.cardOwner) {
        return;
      }

      var location = angular.element('.achievement .wrapper');

      var $button = angular.element('<button unleash-achieve></button>')
        .addClass('achievement__toggle');

      location.after(($compile($button)($scope)));
    };

    /**
     * Close any opened sidebars with card details
     */
    var closeSidebar = function() {
      angular.element(document.body).removeClass('has-menu');

      setTimeout(function() {
        angular.element('.achievement').remove();
      }, 250);
    };

    /**
     * Directive’s link function
     * @param $scope
     */
    var linkFn = function($scope) {
      // Download card data
      $scope.card = cardsService.getCard($scope.cardOwnerId, $scope.cardId);

      // Get an username of the card owner
      userService.getUsername($scope.cardOwnerId).then(function(username) {
        $scope.cardOwner = username;
      });

      // Sets up comments service
      commentsService.setup($scope.cardOwnerId, $scope.cardId);

      // List comments
      commentsService.list().then(function(comments) {
        $scope.messages = comments;
      });

      // Provide a method for adding a message
      $scope.addMessage = function(message) {
        commentsService.add(message, $scope.currentUser);
      };

      // Add an archieved button
      $scope.card.$loaded().then(function() {
        addAchievedButton($scope);
      });

      // Close sidebar
      $scope.close = function() {
        closeSidebar();
      };

      $rootScope.$on('$routeChangeStart', function() {
        closeSidebar();
      });
    };

    return {
      templateUrl: 'views/partials/cardDetails.html',
      replace: true,
      link: linkFn,
      scope: {
        cardOwnerId: '@',
        currentUser: '@username',
        cardId: '@'
      }
    };
  });
