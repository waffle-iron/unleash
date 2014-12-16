'use strict';

angular.module('unleashApp').directive('unleashAccount', function() {
  return {
    templateUrl: 'views/partials/account.html',
    controller: 'ProfileController'
  };
});
