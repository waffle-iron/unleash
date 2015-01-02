'use strict';

angular.module('unleashApp')
  .controller('AccountController', function ($window, $scope, $firebase, FBURL, fbutil, cardsService, userCards) {
    $scope.cards = {};

    // @todo: Make userCards and cardsService more consistent

    // Get a list of user cards for a specific user
    userCards.setup($scope.user.uid).then(function() {
      $scope.cards.dropped = userCards.list();
    });

    // Get a list of card templates
    cardsService.list.then(function(data) {
      $scope.cards.initial = data;
    });

    // Handle drag and drop interface
    $scope.onDropComplete = function(data) {
      userCards.add(data);
    };

    // Remove specific card from user cards
    $scope.remove = function(data) {
      userCards.remove(data);
    };
  });
