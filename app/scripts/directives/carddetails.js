'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashCardDetails
 * @description
 * # Renders card details
 */
angular.module('unleashApp')
  .directive('unleashCardDetails', function($rootScope, templatesService, $compile) {
    var closeSidebar = function() {
      angular.element(document.body).removeClass('has-menu');

      setTimeout(function() {
        angular.element('.achievement').remove();
      }, 250);
    };

    var ctrlFn = function($window, $scope, FBURL, $firebase, $timeout) {
      var ref = new $window.Firebase(FBURL).child('users').child($scope.cardOwnerId).child('cards').child($scope.cardId);
      var sync = $firebase(ref);
      $scope.card = sync.$asObject();

      $rootScope.$on('$routeChangeStart', function() {
        closeSidebar();
      });

      $scope.close = function() {
        closeSidebar();
      };

      // Get username of owner of the card
      ref.parent().parent().once('value', function(snap) {
        $scope.cardOwner = snap.val().username;
      });

      // synchronize a read-only, synchronized array of messages
      $scope.messages = $firebase(ref.child('comments')).$asArray();

      // provide a method for adding a message
      $scope.addMessage = function(newMessage) {
        if( newMessage ) {
          // push a message to the end of the array
          $scope.messages.$add({
            text: newMessage,
            author: $scope.currentUser,
            timestamp: $window.Firebase.ServerValue.TIMESTAMP
          })
            // display any errors
            .catch(alert);
        }
      };

      function alert(msg) {
        $scope.err = msg;
        $timeout(function() {
          $scope.err = null;
        }, 5000);
      }
    };

    var linkFn = function($scope) {
      /**
       * Renders a button for toggling the 'achieved' state in the card
       */
      var addAchievedButton = function() {
        if (!$scope.cardOwner || $scope.currentUser !== $scope.cardOwner) {
          return;
        }

        var location = angular.element('.achievement .wrapper');

        var $button = angular.element('<button unleash-achieve></button>')
          .addClass('achievement__toggle');

        location.after(($compile($button)($scope)));
      };

      $scope.card.$loaded().then(function() {
        addAchievedButton();
      });
    };

    return {
      templateUrl: 'views/partials/cardDetails.html',
      replace: true,
      controller: ctrlFn,
      link: linkFn,
      scope: {
        cardOwnerId: '@',
        currentUser: '@username',
        cardId: '@'
      }
    };
  });
