/**
 * @ngdoc function
 * @name unleashApp.controller:EditPathController
 * @todo Implement thee-way data binding to fully remove flickering
 * @description
 * # EditPathController
 * Controls data for the /account page
 */

'use strict';
angular.module('unleashApp')
  .controller('EditPathController', function ($window, $document, $rootScope, $scope, $location, $routeParams, growl, templatesService, cardsService, userService) {
    $scope.params = $routeParams;
    $scope.cards = null;
    $scope.templates = {};
    $scope.bookmarkTop = 0;
    $scope.showTemplates = true;

    if (!$rootScope.user.isAdmin) {
      growl.error('You are not authorized to see this page!');

      $location.path('/');
    }

    var setupPath = function(uid) {
      // List cards that user has been assigned with
      cardsService.listCards(uid).then(function(cards) {
        $scope.cards = cards;

        getTemplates();

      }).catch(function(error) {
        console.error(error);
      });
    };

    // List templates that are still available to use for the current user
    var getTemplates = function() {
      templatesService.list.then(function(templates) {
        $scope.templates.available = templates;
      }).catch(function(error) {
        console.error(error);
      });
    };

    userService.getByUsername($routeParams.userId).then(function(user) {
      $scope.currentUser = user.id;
      $scope.currentPathOwner = user;
      setupPath(user.id);
    });

    // Get initial templates
    templatesService.list.then(function(templates) {
      $scope.templates.initial = templates;
    }).catch(function(error) {
      growl.error(error);
    });

    // Handle drag and drop interface
    $scope.dropCard = function(event, index, card, external, type) {

      if (type === 'template') {
        card.order = index + 1;
        cardsService.addFromTemplate($scope.currentUser, card).then(function(cards) {
          $scope.cards = cards;
        });
      }

      if (type === 'card') {
        cardsService.move($scope.currentUser, card, index).then(function(cards) {
          $scope.cards = cards;
        });
      }

      return false;
    };

    // @todo Temporary fix to remove available cards flickering
    $scope.removeAvailable = function(index) {
      $scope.templates.available.splice(index, 1);
    };

    // Remove specific card from user cards
    $scope.remove = function(event, index, card, external, type) {
      if (type === 'card') {
        cardsService.remove($scope.currentUser, card).then(function(cards) {
          $scope.cards = cards;
        });
      }
      return false;
    };

    $scope.toggleCards = function() {
      $scope.showTemplates = !$scope.showTemplates;
    };

    $scope.controlTemplates = function() {
      var top =  $scope.bookmarkTop - $window.innerHeight / 2;
      return {
          freeze: ($window.scrollY || $document[0].body.scrollTop) > top,
          freezeTop: top
      };
    };

    $scope.controlCards = function() {
      var top =  $scope.bookmarkTop - $window.innerHeight / 2;
      return {
        freeze: ($window.scrollY || $document[0].body.scrollTop) < top,
        tetherMode: true,
        tetherTop: top
      };
    };
  });
