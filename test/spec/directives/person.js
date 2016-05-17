'use strict';

describe('Directive: unleashPerson', function () {

  var element;
  var outerScope;
  var innerScope;

  var name = 'John Doe';
  var thumb = 'http://placehold.it/350x150';

  beforeEach(module('unleashApp'));
  beforeEach(module('views/home.html'));
  beforeEach(module('views/partials/person.html'));

  beforeEach(module(function($provide) {
    $provide.service('googleApi', function() {
      return {
        load: function(callback) {
        }
      }
    });
  }));

  beforeEach(inject(function($rootScope, $compile, PROFILES_API_URL, $httpBackend) {
    $httpBackend.expectGET(PROFILES_API_URL).respond(200, 'OK');
    element = angular.element('<unleash-person></unleash-person>');
    element.attr('name', name);
    element.attr('thumb', thumb);

    outerScope = $rootScope;
    $compile(element)(outerScope);

    innerScope = element.isolateScope();

    outerScope.$digest();
  }));

  describe('name', function() {
    it('should be rendered', function() {
      expect(element[0].children[0].children[1].innerHTML).to.equal(name);
    });

    it('should display an image', function() {
      expect(element[0].children[0].children[0].src).to.equal(thumb);
      expect(element[0].children[0].children[0].alt).to.equal(name);
    });
  });
});
