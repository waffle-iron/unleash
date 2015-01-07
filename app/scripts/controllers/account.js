'use strict';

angular.module('unleashApp')
  .controller('AccountController', function ($window, $scope, $firebase, FBURL, fbutil, templatesService, cardsService) {
    $scope.cards = null;
    $scope.templates = null;

    // Setup cardsService with user ID
    cardsService.setup($scope.user.uid);

    // List cards that user has been assigned with
    cardsService.listCards().then(function(cards) {
      $scope.cards = cards;
    }).catch(function(error) {
      console.error(error);
    });

    // List templates that are still available to the user
    templatesService.getAvailableTemplates().then(function(templates) {
      $scope.templates = templates;
      $scope.$apply();
    }).catch(function(error) {
      console.error(error);
    });

    // Handle drag and drop interface
    $scope.onDropComplete = function(data) {
      cardsService.add(data);
    };

    // Remove specific card from user cards
    $scope.remove = function(data) {
      cardsService.remove(data);
    };
  });
