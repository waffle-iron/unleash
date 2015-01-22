'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

/*jshint -W079 */
var expect = chai.expect;
/*jshint +W079 */

var appUrl = 'http://localhost:9000/';

describe('E2E: Content', function() {
  beforeEach(function() {
    browser.get(appUrl);
  });

  it('should have a sign up button', function() {
    expect(element(by.css('.auth__google')).getText()).to.eventually.equal('Sign in with Google');
  });

  it('should have a message for logged out users', function() {
    var node = element(by.css('main .primary'));

    expect(node.getText()).to.eventually.equal('Path to #Unleash');
  });
});
