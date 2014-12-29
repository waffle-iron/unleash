'use strict';

angular.module('unleashApp').directive('unleashCardDetails', function() {
  var ctrlFn = function($window, $scope, FBURL, $firebase, $timeout) {
    var ref = new $window.Firebase(FBURL).child('users').child($scope.user).child('cards').child($scope.id);

    $scope.getCard = function () {
      var sync = $firebase(ref);

      $scope.card = sync.$asObject();
    };

    $scope.close = function () {
      angular.element(document.body).removeClass('has-menu');
    };

    // synchronize a read-only, synchronized array of messages, limit to most recent 10
    $scope.messages = $firebase(ref.child('comments'));

    // provide a method for adding a message
    $scope.addMessage = function(newMessage) {
      if( newMessage ) {
        // push a message to the end of the array
        $scope.messages.$add({text: newMessage})
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

  var linkFn = function(scope) {
    scope.getCard();
  };

  return {
    templateUrl: 'views/partials/cardDetails.html',
    replace: true,
    controller: ctrlFn,
    link: linkFn,
    scope: {
      user: '@',
      id: '@'
    }
  };
});
