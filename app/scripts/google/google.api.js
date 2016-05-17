angular.module('google.api', [])
  .factory('googleapi', [function() {
      'use strict';

      return {
        load: function(callback) {
          gapi.load('auth2', function() {
            callback(gapi.auth2.init());
          });
        }
      };

    }
  ]);
