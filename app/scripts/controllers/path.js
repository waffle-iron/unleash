'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:SinglePathController
 * @description
 * # SinglePathController
 * View a single path
 */
angular.module('unleashApp')
  .controller('SinglePathController', function($scope, $q, $compile, fbutil, $location, $timeout, $routeParams, growl, userService, cardsService) {
    // @todo: move a part of functionality to services and directives
    $scope.params = $routeParams;

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
     * @param cardId
     */
    var showSidebar = function(cardId) {
      var $body = angular.element(document.body);

      var ownerId = $scope.currentPathOwner.uid;
      var currentId = $scope.user ? $scope.user.uid : null;

      // Create sidebar element
      var $sidebar = angular.element('<unleash-card-details></unleash-card-details>')
        .attr('data-card-owner-id', ownerId || '')
        .attr('data-current-user-id', currentId || '')
        .attr('data-card-id', cardId || '');

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
    var renderCard = function(cardId) {
      var ownerId = $scope.currentPathOwner.uid;

      // Hide the existing sidebar, if any
      closeSidebar();

      // Display a card
      cardsService.isCardRegistered(ownerId, cardId)
        .then(function() {
          showSidebar(cardId);
        })
        .catch(function() {
          growl.error('Sorry, this card doesn’t exist.');
        });
    };

    // Resolve username from the URL to a google ID stored in Firebase
    userService.getUserUid($routeParams.userId).then(function(uid) {

      // Pull user data
      $scope.currentPathOwner = fbutil.syncObject('users/' + uid);

      $scope.currentPathOwner.$loaded().then(function() {
        if ($scope.user && $scope.currentPathOwner.uid === $scope.user.uid) {
          $scope.currentPathOwner.isCurrentUser = true;
        }
      });

      // Pull user cards
      return cardsService.listCards(uid);
    })
      .catch(function() {
        // No users found!
        $scope.pathNotFound = true;
      })
      .then(function(data) {
        $scope.cards = data;

        if(Object.keys($location.search()).length) {
          $timeout(function() {
            renderCard(Object.keys($location.search())[0]);
          }, 100);
        }

        $scope.$on('$routeUpdate', function() {
          var cardId = Object.keys($location.search())[0];

          if (cardId) {
            renderCard(cardId);
          } else {
            closeSidebar();
          }
        });
      });

    $scope.showCard = function(card) {
      if (isCardAlreadyOpened(card.$id)) {
        $location.search('');
      } else {
        $location.search(card.$id);
      }
    };

  });
