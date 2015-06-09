'use strict';

/**
 * @ngdoc service
 * @name unleashApp.mailService
 * @description
 * # mailService
 * Methods related to sending emails.
 */
angular.module('unleashApp')
  .factory('mailService', function($http) {
    var MAIL_API_URL = 'https://mandrillapp.com/api/1.0/messages/send.json',
        MAIL_API_KEY = 'DltB2SVuBFn5Z0l3OCOwEg';

    var prepareEmailBody = function (subject, content) {
      return {
        key: MAIL_API_KEY,
        message: {
          'from_email': 'no-reply@x-team.com',
          autotext: 'true',
          subject: subject,
          html: content
        }
      };
    };

    var getReceiverData = function (to) {
      return {
        email: to.email,
        name: to.name,
        type: 'to'
      };
    };

    return {
      notifyCardOwner: function (owner) {
        var emailData = prepareEmailBody('Someone has posted a comment', 'Hi, someone has just posted a comment on card in your path to #unleash.');

        emailData.message.to = [ getReceiverData(owner) ];

        return $http.post(MAIL_API_URL, emailData);
      },
      notifyCommentAuthor: function (author) {
        var emailData = prepareEmailBody('Someone has replied to your comment', 'Hi, someone has just replied to your comment.');

        emailData.message.to = [ getReceiverData(author) ];

        return $http.post(MAIL_API_URL, emailData);
      }
    };
  });
