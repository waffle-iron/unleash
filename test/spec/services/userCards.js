'use strict';

describe('Service: userCards', function () {

  // load the service's module
  beforeEach(module('unleashApp'));

  // instantiate service
  var userCards;
  beforeEach(inject(function (_userCards_) {
    userCards = _userCards_;
  }));

  it('should do something', function () {
    expect(!!userCards).toBe(true);
  });

});
