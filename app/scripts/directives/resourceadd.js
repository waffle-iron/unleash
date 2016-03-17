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
      return resourceService.add(resource, scope.skill.slug).then(function () {
        scope.resource.url = '';
        scope.resource.description = '';
      }, function (error) {
        console.error(error);
      });
    };

    return {
      templateUrl: 'views/partials/resourceAdd.html',
      link: function postLink(scope) {
        scope.resource = {};

        scope.resourceAdd = function() {
          scope.isResourceFormVisible = true;
        };

        scope.add = function(resource) {
          add(scope, resource).then(function() {
            scope.isResourceFormVisible = false;
          });
        };

        scope.cancel = function() {
          scope.isResourceFormVisible = false;
        };

      },
      scope: {
        skill: '='
      }
    };
  });
