'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:SinglePathController
 * @description
 * # SinglePathController
 * View a single path
 */
angular.module('unleashApp')
  .controller('SinglePathController', function($scope, $q, fbutil, $timeout, $routeParams, userService, cardsService) {
    // Todo: move functionality to services
    $scope.params = $routeParams;

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

      if($scope.params.cardId) {
        $timeout(function() {
          angular.element('.card').eq(0).trigger('click');
        }, 100);
      }
    });

  });
