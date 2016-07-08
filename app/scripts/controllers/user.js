'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:SinglePathController
 * @description
 * # SinglePathController
 * View a single path
 */
angular.module('unleashApp')
  .controller('SingleUserController', function($rootScope, $scope, $q, $compile, $location, $timeout, $routeParams, growl, userService, cardsService) {
    // @todo: move a part of functionality to services and directives
    $scope.params = $routeParams;
    $scope.initializing = true;

    /**
     * Closes all existing sidebars
     */
    var closeSidebar = function() {
      angular.element(document.body).removeClass('has-menu');

      setTimeout(function() {
        angular.element('.achievement').remove();
      }, 250);
    };

    /**
     * Check if a given card is already being viewed
     * @param id Card $id
     * @returns {boolean}
     */
    var isCardAlreadyOpened = function(id) {
      var currentId = angular.element('.achievement').attr('data-card-id');
      return id === currentId;
    };

    /**
     * Appends data do the sidebar and adds it to the view
     * @param pathId
     * @param card
     */
    var showSidebar = function(pathId, card) {
      var $body = angular.element(document.body);

      // Create sidebar element
      var $sidebar = angular.element('<unleash-card-details></unleash-card-details>')
        .attr('data-card-owner-id', $scope.currentPathOwner.id)
        .attr('data-path-id', pathId)
        .attr('data-current-user-id', $rootScope.user.id)
        .attr('data-card-id', card.id);

      // Add a new sidebar
      setTimeout(function () {
        $body
          .append($compile($sidebar)($scope));

        setTimeout(function () {
          $body.addClass('has-menu');
        }, 10);
      }, 250);
    };

    /**
     * Prepare the page before the sidebar will be displayed
     * @param cardId
     */
    var renderCard = function(pathId, cardId) {
      // Hide the existing sidebar, if any
      closeSidebar();

      // Display a card
      var card = cardsService.getCard(pathId, cardId);
      if (card) {
        showSidebar(pathId, card);
      } else {
        growl.error('Sorry, this card doesn’t exist.');
      }
    };

    var filterEmptyPaths = function(paths) {
      var filteredPaths = [];
      angular.forEach(paths, function(path) {
        if (path.goals.length) {
          filteredPaths.push(path);
        }
      });

      return filteredPaths;
    };

    userService.getByUsername($routeParams.userId).then(function(user) {
      $scope.currentPathOwner = user;
      if ($scope.user.username === $scope.currentPathOwner.username) {
        $scope.currentPathOwner.isCurrentUser = true;
      }

      cardsService.listPaths(user.id).then(function(data) {
        $scope.paths = filterEmptyPaths(data);
        $scope.initializing = false;

        if(Object.keys($location.search()).length) {
          $timeout(function() {
            renderCard($routeParams.pathId, $routeParams.cardId);
          }, 100);
        }

        $scope.$on('$routeUpdate', function() {
          if ($routeParams.cardId && $routeParams.pathId) {
            renderCard($routeParams.pathId, $routeParams.cardId);
          } else {
            closeSidebar();
          }
        });
      });
    })
    .catch(function() {
      // No users found!
      $scope.initializing = false;
      $scope.pathNotFound = true;
    })
    ;

    $scope.showCard = function(pathId, cardId) {
      if (isCardAlreadyOpened(cardId)) {
        $location.search('');
      } else {
        $location.search('cardId', cardId);
        $location.search('pathId', pathId);
      }
    };

    $scope.canEditPath = $rootScope.user.isAdmin || $rootScope.user.username === $routeParams.userId;

  });
