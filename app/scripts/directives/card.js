'use strict';
/* global $ */

angular.module('unleashApp').directive('unleashCard', function() {
  var linkFn = function(scope, element, attrs) {
    var card = angular.element(element);

    $(card).not('.page-account .card').on('click', function() {
      document.body.classList.toggle('has-menu');
    });
  };

  return {
    templateUrl: 'views/partials/card.html',
    scope: {
      type: '@',
      level: '@',
      task: '@'
    },
    replace: true,
    link: linkFn
  };
});
