angular.module('mock.googleApi', [])
  .factory('googleApi', function() {
    return {
      load: function(callback) {
        console.log('Mock Google Api');
        callback({});
      }
    }
  });
