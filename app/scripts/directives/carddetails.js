'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashCardDetails
 * @description
 * # Renders card details
 */
angular.module('unleashApp')
  .directive('unleashCardDetails', function($rootScope, $compile, $location, growl, userService, cardsService, commentsService) {
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
      cardsService.getCard({
        ownerId: $scope.cardOwnerId,
        userId: $scope.currentUserId,
        cardId: $scope.cardId
      }).then(function(data) {
        $scope.card = data;

        // Add an archieved button
        if($rootScope.user.isAdmin) {
          $scope.isCurrentUserAdmin = $rootScope.user.isAdmin;
          addAchievedButton($scope);
        }

        $scope.canSetDueDate = !!($scope.cardOwnerId === $scope.currentUserId || $rootScope.user.isAdmin);
      }).catch(function() {
        growl.error('Sorry, this card doesn’t exist.');
      });

      // Get an username of the current user
      userService.getUserDetails($scope.currentUserId).then(function(data) {
        $scope.currentUser = {
          name: data.username,
          fullName: data.fullName
        };
      });

      // Get an username of the card owner
      userService.getUserDetails($scope.cardOwnerId).then(function(data) {
        $scope.cardOwner = {
          email: data.email,
          fullName: data.fullName,
          picture: data.picture,
          name: data.username
        };
      });

      // Sets up comments service
      commentsService.setup($scope.cardOwnerId, $scope.cardId);

      // List comments
      commentsService.list().then(function(comments) {
        $scope.messages = comments;
      });

      // Provide a method for adding a message
      $scope.addMessage = function(message) {
        commentsService.add({
          message: message,
          author: $scope.currentUser,
          cardOwner: $scope.cardOwner,
          cardType: $scope.card.type,
          cardId: $scope.card.$id
        });
      };

      // Provide a method for adding a reply to a comment
      $scope.addReply = function(message, reply) {
        // Get email address of comment author
        userService.getUserUid(message.author)
          .then(userService.getUserDetails)
          .then(function (commentAuthor) {
            commentsService.addReply({
              message: reply,
              author: $scope.currentUser,
              cardOwner: $scope.cardOwner,
              cardType: $scope.card.type,
              cardId: $scope.card.$id,
              parent: {
                id: message.$id,
                author: {
                  name: commentAuthor.username,
                  fullName: commentAuthor.fullName,
                  email: commentAuthor.email
                }
              }
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
          cardsService.updateDueDate($scope.cardId, $scope.card.dueDate);
        }
      });
    };

    return {
      templateUrl: 'views/partials/cardDetails.html',
      replace: true,
      link: linkFn,
      scope: {
        cardOwnerId: '@',
        currentUserId: '@',
        cardId: '@'
      }
    };
  });
