'use strict';

/**
 * @ngdoc function
 * @name unleashApp.controller:PathController
 * @description
 * # PathController
 * Displaying a list of users.
 */
angular.module('unleashApp')
  .controller('PathController', function () {

  })

/**
 * @ngdoc function
 * @name unleashApp.controller:SinglePathController
 * @description
 * # SinglePathController
 * View a single path
 */
  .controller('SinglePathController', function($scope, fbutil, $timeout, $routeParams, userService) {
    // Todo: move functionality to services
    $scope.params = $routeParams;
    $scope.users = {};

    // Resolve username from the URL to a google ID stored in Firebase
    userService.getUserUid($routeParams.userId).then(function(uid) {
      // Pull user data
      $scope.users.current = fbutil.syncObject('users/' + uid);

      // Pull cards by this user
      $scope.cards = fbutil.syncArray('users/' + uid + '/cards');
    }, function() {
      // No users found!
      $scope.users.notfound = true;
    });
  });
