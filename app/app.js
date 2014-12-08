'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'firebase',
  'myApp.services',
  'myApp.view1',
  'myApp.view2',
  'myApp.routes'
]).controller('MainCtrl', ["$scope", "Auth", "userService", function($scope, Auth, userService) {
	$scope.auth = Auth;
	$scope.user = $scope.auth.$getAuth();

	$scope.login = function() {
		userService.login();
	};

	$scope.logout = function() {
		userService.logout();
	};
}]);
