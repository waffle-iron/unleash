'use strict';

/**
 * @ngdoc service
 * @name unleashApp.mailService
 * @description
 * # mailService
 * Methods related to sending emails.
 */
angular.module('unleashApp')
  .factory('mailService', function($http, $q, MAIL_CONFIG) {

    var prepareEmailBody = function (to, subject, content) {
      var deferred = $q.defer();

      if (!MAIL_CONFIG.key || 0 === MAIL_CONFIG.key.length) {
        deferred.reject(new Error('Mail API key is not valid! Please check your configuration.'));
      } else {
        deferred.resolve({
          key: MAIL_CONFIG.key,
          message: {
            'from_email': 'no-reply@x-team.com',
            autotext: 'true',
            subject: subject,
            html: content,
            to: [ getReceiverData(to) ]
          }
        });
      }

      return deferred.promise;
    };

    var getReceiverData = function (to) {
      return {
        email: to.email,
        name: to.name,
        type: 'to'
      };
    };

    var sendEmail = function (to, subject, content) {
      return prepareEmailBody(to, subject, content)
        .then(function (data) {
          return $http.post(MAIL_CONFIG.url, data);
        }, function (error) {
          console.error('Could not send email.', error);
        });
    };

    return {
      notifyCardOwner: function (owner) {
        return sendEmail(owner, 'Someone has posted a comment', 'Hi, someone has just posted a comment on card in your path to #unleash.');
      },
      notifyCommentAuthor: function (author) {
        return sendEmail(author, 'Someone has replied to your comment', 'Hi, someone has just replied to your comment.');
      }
    };
  });
