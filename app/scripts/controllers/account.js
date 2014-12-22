'use strict';

angular.module('unleashApp')
  .controller('AccountController', ['$window', '$scope', '$firebase', 'FBURL', 'fbutil', 'cardsService', function ($window, $scope, $firebase, FBURL, fbutil, cardsService) {
    var ref = new $window.Firebase(FBURL);
    var sync = $firebase(ref.child('users').child($scope.user.uid).child('cards'));

    $scope.cards = {};
    $scope.cards.dropped = sync.$asArray();
    $scope.users = {};

    // We are editing our own profile, so we are the current user
    $scope.users.current = $scope.user;

    cardsService.list.then(function(data) {
      $scope.cards.initial = data;
    });

    // Handle drag and drop interface
    $scope.onDropComplete = function(data){
      var index = $scope.cards.dropped.indexOf(data);
      if (index === -1) {
        $scope.cards.dropped.$add(data);
      }
    };
    $scope.onDragSuccess = function(data){
      var index = $scope.cards.dropped.indexOf(data);
      if (index > -1) {
        $scope.cards.dropped.$remove($scope.cards.dropped[index]);
      }
    };

  }]);
