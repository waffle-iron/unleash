'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

/*jshint -W079 */
var expect = chai.expect;
/*jshint +W079 */

var appUrl = 'http://localhost:9000/';

describe('E2E: Routes', function() {
  it('should load the index page', function() {
    browser.get(appUrl);

    expect(browser.getCurrentUrl()).to.eventually.equal(appUrl + '#/');
  });
});
