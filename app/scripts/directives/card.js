'use strict';
/* global $ */

angular.module('unleashApp').directive('unleashCard', function($compile) {
  var showCardDetails = function(scope, user, id) {
    var $body = angular.element(document.body);

    // Create sidebar element
    var $sidebar = angular.element('<unleash-card-details></unleash-card-details>')
      .attr('user', user)
      .attr('id', id);

    // If exists, hide existing sidebar
    $body.removeClass('has-menu');

    // Remove rendered sidebar directive from DOM
    angular.element('.achievement').remove();

    // Add new sidebar
    $body
      .append($compile($sidebar)(scope))
      .addClass('has-menu');

  };

  var linkFn = function(scope, element) {
    var card = angular.element(element);

    $(card).not('.page-account .card').on('click', function() {
      var user = $(this).attr('user-id');
      var id = $(this).attr('card-id');

      showCardDetails(scope, user, id);
    });
  };

  return {
    templateUrl: 'views/partials/card.html',
    scope: {
      user: '@userId',
      id: '@cardId',
      type: '@',
      level: '@',
      task: '@'
    },
    replace: true,
    link: linkFn
  };
});
