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

    var cardUrl = function (data) {
      return 'http://unleash.x-team.com/paths/' + data.cardOwner.name + '/?' + data.cardId;
    };

    return {
      notifyCardOwner: function (data) {
        return sendEmail(data.cardOwner,
          'Someone has posted a comment',
          [
            '<h1>Hello, ' + data.cardOwner.name + '</h1>',
            '<p>' + data.author + ' just commented your "' + data.cardType + '" step:</p>',
            '<p>' + data.message + '</p>',
            '<p><a href="' + cardUrl(data) + '">Click here</a> to visit your Path!</p>'
          ].join('')
        );
      },
      notifyCardOwnerReply: function (data) {
        return sendEmail(data.cardOwner,
          'Someone has posted a comment',
          [
            '<h1>Hello, ' + data.cardOwner.name + '</h1>',
            '<p>' + data.author + ' just replied to the comment on your "' + data.cardType + '" step:</p>',
            '<p>' + data.message + '</p>',
            '<p><a href="' + cardUrl(data) + '">Click here</a> to visit your Path!</p>'
          ].join('')
        );
      },
      notifyCommentAuthor: function (data) {
        return sendEmail(data.parent.author,
          'Someone has replied to your comment',
          [
            '<h1>Hello, ' + data.parent.author.name + '</h1>',
            '<p>' + data.author + ' just replied to your "' + data.cardType + '" step comment:</p>',
            '<p>' + data.message + '</p>',
            '<p><a href="' + cardUrl(data) + '">Click here</a> to visit your Path!</p>'
          ].join('')
        );
      },
      notifyReplyAuthor: function (data, previousAuthor) {
        return sendEmail(previousAuthor,
          'Someone has replied to your comment',
          [
            '<h1>Hello, ' + previousAuthor.name + '</h1>',
            '<p>' + data.author + ' just replied to your reply to the "' + data.cardType + '" step comment:</p>',
            '<p>' + data.message + '</p>',
            '<p><a href="' + cardUrl(data) + '">Click here</a> to visit your Path!</p>'
          ].join('')
        );
      }
    };
  });
