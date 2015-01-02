'use strict';

angular.module('unleashApp').directive('unleashCardDetails', function(cardsService) {
  var ctrlFn = function($window, $scope, FBURL, $firebase, $timeout) {
    var ref = new $window.Firebase(FBURL).child('users').child($scope.cardOwnerId).child('cards').child($scope.cardId);
    var sync = $firebase(ref);
    $scope.card = sync.$asObject();

    $scope.close = function() {
      cardsService.closeSidebar();
    };

    $scope.markAsAchieved = function() {
      cardsService.markAsAchieved($scope.card);
    };

    // synchronize a read-only, synchronized array of messages
    $scope.messages = $firebase(ref.child('comments')).$asArray();

    // Get username of owner of the card
    ref.parent().parent().once('value', function(snap) {
      $scope.cardOwner = snap.val().username;
    });

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

  return {
    templateUrl: 'views/partials/cardDetails.html',
    replace: true,
    controller: ctrlFn,
    scope: {
      cardOwnerId: '@',
      currentUser: '@username',
      cardId: '@'
    }
  };
});
