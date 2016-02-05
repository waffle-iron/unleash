(function() {
  'use strict';

  // Mandrill API Url
  var MANDRILL_URL = 'https://mandrillapp.com/api/1.0/messages/send.json';
  // Mandrill API Key (Env variable to be replaced by grunt)
  var MANDRILL_API_KEY = '@@MANDRILL_KEY';

  var BOT_URL = '@@BOT_URL';

  angular
    .module('unleashApp')
    .constant('dataPath', 'scripts/data/')
    // Mail API constants
    .constant('MAIL_CONFIG', { url: MANDRILL_URL, key: MANDRILL_API_KEY })
    .constant('SLACK_CONFIG', { botUrl: BOT_URL });
})();
