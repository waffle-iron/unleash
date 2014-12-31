'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashTemplateView
 * @description
 * # unleashTemplateView
 */
angular.module('unleashApp')
  .directive('unleashTemplateView', function ($compile) {
    var makeEditable = function(scope, element, attrs) {
      var $edit = angular.element('<div unleash-template-edit></div>')
        .addClass('template template--edit')
        .attr('data-id', attrs.id);

      element.closest('li').removeClass('view').addClass('edit');
      element.append($compile($edit)(scope));
    };

    return {
      templateUrl: 'views/partials/templateView.html',
      link: function postLink(scope, element, attrs) {
        scope.edit = function() {
          makeEditable(scope, element, attrs);
        };
      },
      scope: {
        card: '='
      }
    };
  });
