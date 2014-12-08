'use strict';

angular.module('myApp.routes', ['ngRoute'])

.run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
		if (error === "AUTH_REQUIRED") {
			$location.path("/home");
		}
	});
}])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when("/home", {
		controller: "View1Ctrl",
		templateUrl: "view1/view1.html",
		resolve: {
			"currentAuth": ["Auth", function(Auth) {
				return Auth.$waitForAuth();
			}]
		}
	}).when("/path/:userId", {
		controller: "View2Ctrl",
		templateUrl: "view2/view2.html",
		resolve: {
			"currentAuth": ["Auth", function(Auth) {
				return Auth.$requireAuth();
			}]
		}
	}).otherwise({redirectTo: '/home'});
}])

.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
}]);
