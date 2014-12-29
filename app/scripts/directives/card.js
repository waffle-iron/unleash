'use strict';
/* global $ */

angular.module('unleashApp').directive('unleashCard', function($compile) {
  var showCardDetails = function(scope, cardOwnerId, username, cardId) {
    var $body = angular.element(document.body);

    // Create sidebar element
    var $sidebar = angular.element('<unleash-card-details></unleash-card-details>')
      .attr('card-owner-id', cardOwnerId)
      .attr('username', username)
      .attr('card-id', cardId);

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
      var cardOwnerId = $(this).attr('card-owner-id');
      var username = $(this).attr('username');
      var cardId = $(this).attr('card-id');

      showCardDetails(scope, cardOwnerId, username, cardId);
    });
  };

  return {
    templateUrl: 'views/partials/card.html',
    scope: {
      card: '=cardData',
      cardOwnerId: '@',
      username: '@',
      cardId: '@'
    },
    replace: true,
    link: linkFn
  };
});
