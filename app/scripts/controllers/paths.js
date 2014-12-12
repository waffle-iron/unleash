'use strict';
/**
 * @ngdoc function
 * @name unleashApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('unleashApp')
  .controller('PathController', function ($scope, fbutil) {

  })
  .controller('SinglePathController', ['$scope', 'fbutil', '$timeout', '$routeParams', 'userService', function($scope, fbutil, $timeout, $routeParams, userService) {
    $scope.params = $routeParams;

    userService.getUserId('wojtek').then(function() {
      console.log('asd');
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
