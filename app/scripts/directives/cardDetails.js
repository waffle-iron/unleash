'use strict';
/* global $ */

angular.module('unleashApp').directive('unleashCardDetails', function() {
  var ctrlFn = function($window, $scope, FBURL, $firebase, $element) {
    var ref = new $window.Firebase(FBURL);

    $scope.getCard = function (user, id) {
      var sync = $firebase(ref.child('users').child(user).child('cards').child(id));

      $scope.card = sync.$asObject();
    };
  };

  var linkFn = function(scope, iElement, iAttrs, ctrl) {
    scope.getCard(iAttrs.user, iAttrs.id);
  };

  return {
    templateUrl: 'views/partials/cardDetails.html',
    replace: true,
    controller: ctrlFn,
    link: linkFn,
    scope: {
      user: '@',
      id: '@'
    }
  };
});
