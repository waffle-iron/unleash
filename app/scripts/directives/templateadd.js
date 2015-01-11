'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashTemplateAdd
 * @description
 * # unleashTemplateAdd
 */
angular.module('unleashApp')
  .directive('unleashTemplateAdd', function (templatesService) {
    var add = function(scope, template, eq) {
      templatesService.add(template).then(function() {
        templatesService.newTemplates.splice(eq, 1);
      }, function(error) {
        console.error(error);
      });
    };

    var remove = function(eq) {
      templatesService.removeNew(eq);
    };

    return {
      templateUrl: 'views/partials/templateAdd.html',
      link: function postLink(scope, element, attrs) {
        scope.add = function(template) {
          add(scope, template, attrs.eq);
        };

        scope.remove = function() {
          remove(attrs.eq);
        };
      },
      scope: {
        template: '='
      }
    };
  });
