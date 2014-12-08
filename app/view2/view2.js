'use strict';

angular.module('myApp.view2', ['ngRoute'])

.controller('View2Ctrl', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams) {
	$scope.params = $routeParams;
}]);
