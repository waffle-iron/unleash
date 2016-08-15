'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashCardDetails
 * @description
 * # Renders card details
 */
angular.module('unleashApp')
  .directive('unleashCardDetails', function($rootScope, $routeParams, $compile, $location, growl, userService, cardsService, commentsService) {
    /**
     * Renders a button for toggling the 'achieved' state in the card
     */
    var addAchievedButton = function($scope) {
      var location = angular.element('.achievement__settings');

      var $button = angular.element('<div unleash-achieve></div>')
        .addClass('achievement__toggle-achieved');

      location.append(($compile($button)($scope)));
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
      var card = cardsService.getCard($scope.pathId, $scope.cardId);
      if (card) {
        $scope.card = card;

        // Add an archieved button
        if($rootScope.user.isAdmin) {
          $scope.isCurrentUserAdmin = $rootScope.user.isAdmin;
          addAchievedButton($scope);
        }

        $scope.canSetDueDate = !!($scope.cardOwnerId === $scope.currentUserId || $rootScope.user.isAdmin);
      } else {
        growl.error('Sorry, this card doesn’t exist.');
      }

      userService.getByUsername($routeParams.userId).then(function(user) {
        $scope.cardOwner = user;
      });

      $scope.messages = card.comments;

      // Provide a method for adding a message
      $scope.addMessage = function(message) {
        commentsService.add({
          message: message,
          author: $rootScope.user,
          cardOwner: $scope.cardOwner,
          cardOwnerId: $scope.cardOwnerId,
          cardType: $scope.card.name,
          cardId: $scope.card.id
        }).then(function(comments) {
          $scope.messages = comments;
        });
      };

      // Provide a method for adding a reply to a comment
      $scope.addReply = function(message, reply) {
        // Get email address of comment author
        userService.getByUsername(message.author).then(function(commentAuthor) {
          commentsService.addReply({
            message: reply,
            card: $scope.card,
            author: $rootScope.user,
            cardOwner: $scope.cardOwner,
            cardOwnerId: $scope.cardOwnerId,
            parent: {
              id: message.id,
              author: {
                name: commentAuthor.username,
                fullName: commentAuthor.fullName,
                email: commentAuthor.email
              }
            }
          }).then(function(comments) {
            $scope.messages = comments;
          });
        });
      };

      // Unset current due date
      $scope.clearDueDate = function() {
        $scope.card.dueDate = null;
      };

      // Close sidebar
      $scope.close = function() {
        $location.search('');
      };

      $scope.$on('$routeChangeStart', function() {
        closeSidebar();
      });

      $scope.$watch(function() {
        return $scope.card.dueDate;
      }, function(newVal, oldVal) {
        // We want to allow for null explicitly which means "no due date"
        if (newVal !== undefined && newVal !== oldVal) {
          cardsService.updateDueDate($scope.pathId, $scope.cardId, $scope.card.dueDate);
        }
      });
    };

    return {
      templateUrl: 'views/partials/cardDetails.html',
      replace: true,
      link: linkFn,
      scope: {
        cardOwnerId: '@',
        pathId: '@',
        currentUserId: '@',
        cardId: '@'
      }
    };
  });
