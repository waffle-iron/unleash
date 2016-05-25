'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashTemplateEdit
 * @description
 * # unleashTemplateEdit
 */
angular.module('unleashApp')
  .directive('unleashTemplateEdit', function (templatesService, growl) {
    var cloneTemplateProps = function(scope) {
      scope.updated = {};

      ['name', 'level', 'description', 'tags', 'icon'].forEach(function(prop) {
        scope.updated[prop] = scope.template[prop];
      });
    };

    var save = function(id, scope, element) {
      templatesService.update(id, scope.updated).then(function () {
        element.closest('li').removeClass('edit').addClass('view');
        element.remove();
        ['name', 'level', 'description', 'tags', 'icon'].forEach(function(prop) {
          scope.template[prop] = scope.updated[prop];
        });
      });
    };

    var remove = function(id, scope, element) {
      templatesService.removeStored(id).then(function() {
        growl.success('Template successfully removed');
        element.closest('li').remove();
      });
    };

    return {
      templateUrl: 'views/partials/templateEdit.html',
      controller: function editController($scope) {
        cloneTemplateProps($scope);
      },
      link: function editLink(scope, element, attrs) {
        scope.save = function() {
          save(attrs.id, scope, element);
        };

        scope.remove = function() {
          remove(attrs.id, scope, element);
        };
      },
      transclude: true
    };
  });
