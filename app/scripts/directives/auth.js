'use strict';

angular.module('unleashApp').directive('unleashAuth', function() {
  return {
    templateUrl: 'views/partials/auth.html',
    controller: 'AuthController'
  };
});
