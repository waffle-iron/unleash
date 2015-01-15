'use strict';

/**
 * @ngdoc service
 * @name unleashApp.commentsService
 * @description
 * # comments
 * Factory in the unleashApp.
 */
angular.module('unleashApp')
  .factory('commentsService', function ($window, FBURL, $firebase, $q, growl) {
    var ref = null;
    var currentUser = null;
    var comments = {};

    return {
      /**
       * Setup the service
       * @param userId ID of the owner of the card
       * @param cardId Card ID
       * @returns {*}
       */
      setup: function(userId, cardId) {
        return $q(function(resolve, reject) {

          if(userId && cardId) {
            // Initialize setup
            currentUser = userId;

            ref = new $window.Firebase(FBURL).child('users').child(userId).child('cards').child(cardId);
            comments = $firebase(ref.child('comments')).$asArray();

            comments.$loaded().then(function() {
              resolve();
            });
          }

          else if(currentUser) {
            // Setup has already been done
            resolve();
          }

          else {
            growl.error('You need to setup the comments service first.');

            reject();
          }

        });
      },

      /**
       * List comments
       * @returns {Promise} Comments
       */
      list: function() {
        var self = this;

        return $q(function(resolve) {
          self.setup().then(function() {
            resolve(comments);
          });
        });
      },

      /**
       * Add a comment
       * @param newComment
       * @param user
       */
      add: function(newComment, user) {
        if (newComment) {
          // push a message to the end of the array
         comments.$add({
            text: newComment,
            author: user,
            timestamp: $window.Firebase.ServerValue.TIMESTAMP
          })
            // display any errors
            .catch(growl.error);
        }
      }
    };
  });
