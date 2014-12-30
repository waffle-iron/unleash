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
        .attr('card', scope.card);

      // Add a new sidebar
      setTimeout(function() {
        element
          .replaceWith($compile($edit)(scope));
      }, 250);
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
