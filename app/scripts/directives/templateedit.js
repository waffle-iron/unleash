'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashTemplateEdit
 * @description
 * # unleashTemplateEdit
 */
angular.module('unleashApp')
  .directive('unleashTemplateEdit', function (templatesService) {
    var getTemplateData = function(template) {
      return {
        'type': template.type,
        'level': template.level || '',
        'task': template.task || '',
        'icon': template.icon || ''
      };
    };

    var cloneTemplateProps = function(scope) {
      scope.updated = {};

      ['type', 'level', 'task', 'icon'].forEach(function(prop) {
        scope.updated[prop] = scope.template[prop];
      });
    };

    var showModal = function (scope, element) {
      var $modal = element.find('.modal'),
          $iconContainer = element.find('.icon'),
          currentIconClass = '.' + scope.updated.icon;

      $modal.addClass('view');

      if(currentIconClass !== '.') {
        $modal.find(currentIconClass).parent().addClass('current');
      }
      
      /*
       * bind modal events;
       */
      
      $modal.find('.modal__icon').on('click', function () {
        scope.updated.icon = this.children[0].className;
        $iconContainer[0].children[0].className = (this.children[0].className);
        $modal.removeClass('view');
        $modal.find('.modal__icon').unbind('click');

        if(currentIconClass !== '.') {
          $modal.find(currentIconClass).parent().removeClass('current');
        }
      });
    };

    var save = function(id, data, element) {
      var template = getTemplateData(data);
      templatesService.update(id, template).then(function() {
        element.closest('li').removeClass('edit').addClass('view');
        element.remove();
      }, function(error) {
        console.error(error);
      });
    };

    var remove = function(id) {
      templatesService.removeStored(id);
    };

    return {
      templateUrl: 'views/partials/templateEdit.html',
      controller: function editController($scope) {
        cloneTemplateProps($scope);
      },
      link: function editLink(scope, element, attrs) {
        scope.save = function() {
          save(attrs.id, scope.updated, element);
        };

        scope.remove = function() {
          remove(attrs.id);
        };
        
        scope.showModal = function () {
          showModal(scope,element);
        };
      },
      transclude: true
    };
  });
