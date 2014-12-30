'use strict';

/**
 * @ngdoc directive
 * @name unleashApp.directive:unleashTemplateView
 * @description
 * # unleashTemplateView
 */
angular.module('unleashApp')
  .directive('unleashTemplateView', function ($compile) {
    var makeEditable = function(scope, element) {
      console.log(scope.card);

      var $edit = angular.element('<li class="template edit" unleash-template-edit></li>')
        .addClass('template edit')
        .attr('card', scope.card);

      element.replaceWith($compile($edit)(scope));
    };

    return {
      templateUrl: 'views/partials/templateView.html',
      link: function postLink(scope, element, attrs) {
        scope.edit = function() {
          makeEditable(scope, element);
        };
      },
      scope: {
        card: '='
      }
    };
  });
