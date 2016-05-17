angular.module('mock.googleapi', ['google.api'])
  .config(function($provide) {
    $provide.decorator('googleapi', function($delegate) {
      console.log($delegate);

      $delegate.$$load = function(callback) {
        console.log('load googleapi');
        callback({});
      };

      return $delegate;
    });
  });
