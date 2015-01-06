'use strict';

angular.module('unleashApp')
  .controller('AccountController', function ($window, $scope, $firebase, FBURL, fbutil, cardsService, userCards) {
    $scope.cards = {};

    // @todo: Make userCards and cardsService more consistent

    // Setup userCards with user ID
    userCards.setup($scope.user.uid);

    // List cards that user has been assigned with
    userCards.listCards().then(function(cards) {
      $scope.cards.dropped = cards;
    }).catch(function(error) {
      console.error(error);
    });

    // List templates that are still available to the user
    userCards.getAvailableTemplates().then(function(templates) {
      $scope.cards.available = templates;
      $scope.$apply();
    }).catch(function(error) {
      console.error(error);
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
