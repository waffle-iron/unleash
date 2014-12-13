'use strict';
/**
 * @ngdoc function
 * @name unleashApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('unleashApp')
  .controller('PathController', function () {

  })
  .controller('SinglePathController', ['$scope', 'fbutil', '$timeout', '$routeParams', 'userService', function($scope, fbutil, $timeout, $routeParams, userService) {
    $scope.params = $routeParams;
    $scope.users = {};

    userService.getUserUid($routeParams.userId).then(function(uid) {
      $scope.users.current = uid;
    }, function(err) {
      $scope.users.notfound = true;
      console.error(err);
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
