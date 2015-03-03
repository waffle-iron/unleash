'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashIconModal
 * @description
 * # unleash icon modal
 */

angular.module('unleashApp')
  .directive('unleashIconsModal', function() {
    var showModal = function (scope, element) {
      var $modal = element.find('.modal'),
          $iconContainer = element.find('.icon'),
          currentIconClass = '.' + scope.template.icon;

      $modal.addClass('view');

      if(currentIconClass !== '.') {
        $modal.find(currentIconClass).parent().addClass('current');
      }
      
      /*
       * bind modal events;
       */
      
      $modal.find('.modal__icon').on('click', function () {
        scope.template.icon = this.children[0].className;
        $iconContainer[0].children[0].className = (this.children[0].className);
        $modal.removeClass('view');
        $modal.find('.modal__icon').unbind('click');

        if(currentIconClass !== '.') {
          $modal.find(currentIconClass).parent().removeClass('current');
        }
      });
    };

    return {
      templateUrl: 'views/partials/templateIconsModal.html',
      replace: false,
      link: function templateIconsModal(scope, element, attrs) {
        scope.showModal = function () {
          showModal(scope,element);
        };
        
        /*
         * When adding template set default value
         */
        if(attrs.config === 'add') {
          scope.template.icon = 'icon-home3';
        }
      }
    };
  });
