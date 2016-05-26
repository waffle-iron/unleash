'use strict';

/**
 * @ngdoc service
 * @name unleashApp.googleService
 * @description
 * # googleService
 */
angular.module('unleashApp')
  .factory('googleService', function($q, $rootScope) {

    return {
      getCurrentUser: function() {
        return $rootScope.auth2.currentUser.get();
      },
      signIn: function() {
        var defer = $q.defer();
        var self = this;

        $rootScope.auth2.signIn().then(function() {
          defer.resolve(self.getCurrentUser());
        });

        return defer.promise;
      },
      signOut: function() {
        return $rootScope.auth2.signOut();
      }
    };
  });
