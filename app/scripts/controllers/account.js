'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:AccountController
 * @description
 * # AccountController
 * Controls data for the /account page
 */
angular.module('unleashApp')
  .controller('AccountController', function ($window, $scope, $firebase, FBURL, fbutil, growl, templatesService, cardsService) {
    $scope.cards = null;
    $scope.templates = {};

    // @todo: Implement thee-way data binding to fully remove flickering

    // List templates that are still available to use for the current user
    var getTemplates = function() {
      templatesService.getAvailableTemplates($scope.user.uid).then(function(templates) {
        $scope.templates.available = templates;
        $scope.$apply();
      }).catch(function(error) {
        console.error(error);
      });
    };

    // Get initial templates
    templatesService.list.then(function(templates) {
      $scope.templates.initial = templates;
    }).catch(function(error) {
      growl.error(error);
    });

    // List cards that user has been assigned with
    cardsService.listCards($scope.user.uid).then(function(cards) {
      $scope.cards = cards;

      getTemplates();

      cards.$watch(function() {
        getTemplates();
      });
    }).catch(function(error) {
      console.error(error);
    });

    // Handle drag and drop interface
    $scope.onDropComplete = function(data) {
      cardsService.add(data);
    };

    // @todo Temporary fix to remove available cards flickering
    $scope.removeAvailable = function(index) {
      $scope.templates.available.splice(index, 1);
    };

    // Remove specific card from user cards
    $scope.remove = function(data) {
      cardsService.remove(data);
    };
  });
