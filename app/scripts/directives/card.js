'use strict';
/* global $ */

angular.module('unleashApp').directive('unleashCard', function() {
  return {
    templateUrl: 'views/partials/card.html',
    scope: true,
    replace: true,
    transclude: true,
    link: function(scope, element) {
      var card = angular.element(element);

      $(card).not('.page-account .card').on('click', function() {
        document.body.classList.toggle('has-menu');
      });
    }
  };
});
