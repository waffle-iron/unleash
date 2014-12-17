'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:PathController
 * @description
 * # PathController
 * Displaying a list of users.
 */
angular.module('unleashApp')
  .controller('PathController', function () {

  })

/**
 * @ngdoc function
 * @name unleashApp.controller:SinglePathController
 * @description
 * # SinglePathController
 * View a single path
 */
  .controller('SinglePathController', ['$scope', 'fbutil', '$timeout', '$routeParams', 'userService', function($scope, fbutil, $timeout, $routeParams, userService) {
    // Todo: move functionality to services
    $scope.params = $routeParams;
    $scope.users = {};

    // Resolve username from the URL to a google ID stored in Firebase
    userService.getUserUid($routeParams.userId).then(function(uid) {
      $scope.users.current = uid;

      // Pull cards by this user
      $scope.cards = fbutil.syncArray('users/' + uid + '/cards');
    }, function() {
      // No users found!
      $scope.users.notfound = true;
    });

    // synchronize a read-only, synchronized array of messages, limit to most recent 10
    $scope.messages = fbutil.syncArray('messages');

    // display any errors
    $scope.messages.$loaded().catch(alert);

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
  }]);
