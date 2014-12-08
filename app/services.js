var app = angular.module("myApp.services", ["firebase"]);

// let's create a re-usable factory that generates the $firebaseAuth instance
app.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
	var ref = new Firebase("https://radiant-fire-1291.firebaseio.com/");
	return $firebaseAuth(ref);
}]);

app.factory("userService", function() {
	var ref = new Firebase("https://radiant-fire-1291.firebaseio.com/");

	return {
		login: function() {
			ref.authWithOAuthPopup("github", function(error, authData) {
				console.log(authData);
				window.location.href = "/";
			});
		},
		logout: function() {
			ref.unauth();
		}
	}
});
