'use strict';

angular.module('unleashApp')
  .controller('AccountController', function ($window, $scope, $firebase, FBURL, fbutil, cardsService, userCards) {
    $scope.cards = {};

    // @todo: Make userCards and cardsService more consistent
    userCards.setup($scope.user.uid).then(function() {
      $scope.cards.dropped = userCards.list();
    });

    cardsService.list.then(function(data) {
      $scope.cards.initial = data;
    });

    // Handle drag and drop interface
    $scope.onDropComplete = function(data) {
      userCards.add(data);
    };

    //$scope.onDragSuccess = function() {
    //  console.log('Dragging has finished');
    //};

    $scope.remove = function(data) {
      userCards.remove(data);
    };

  });
