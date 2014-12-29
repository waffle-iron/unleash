'use strict';

angular.module('unleashApp').directive('unleashCardDetails', function(cardsService) {
  var ctrlFn = function($window, $scope, FBURL, $firebase, $timeout) {
    var ref = new $window.Firebase(FBURL).child('users').child($scope.cardOwnerId).child('cards').child($scope.cardId);
    var sync = $firebase(ref);
    $scope.card = sync.$asObject();

    $scope.close = function() {
      cardsService.closeSidebar();
    };

    // synchronize a read-only, synchronized array of messages, limit to most recent 10
    $scope.messages = $firebase(ref.child('comments')).$asArray();

    // provide a method for adding a message
    $scope.addMessage = function(newMessage) {
      if( newMessage ) {
        // push a message to the end of the array
        $scope.messages.$add({text: newMessage, author: $scope.username})
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
      username: '@',
      cardId: '@'
    }
  };
});
