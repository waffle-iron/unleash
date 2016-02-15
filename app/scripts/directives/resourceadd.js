'use strict';
/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashResourceAdd
 * @description
 * # unleashResourceAdd
 */
angular.module('unleashApp')
  .directive('unleashResourceAdd', function (resourceService) {

    var add = function(scope, resource) {
      resourceService.add(resource).then(function () {
        // do nothing
      }, function (error) {
        console.error(error);
      });
    };

    return {
      templateUrl: 'views/partials/resourceAdd.html',
      link: function postLink(scope) {
        scope.add = function(resource) {
          add(scope, resource);
        };
      },
      scope: {
        resource: '='
      }
    };
  });
