'use strict';

describe('Directive: unleashTemplateView', function () {

  var element;
  var outerScope;
  var innerScope;

  var template = {
    name: 'Type',
    level: 1,
    description: 'Example task'
  };

  beforeEach(module('unleashApp'));
  beforeEach(module('views/home.html'));
  beforeEach(module('views/partials/templateView.html'));

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
    element = angular.element('<li unleash-template-view template="template"></li>');

    outerScope = $rootScope;

    outerScope.template = template;

    $compile(element)(outerScope);

    innerScope = element.isolateScope();

    outerScope.$digest();
  }));

  describe('template', function() {
    it('should display its name', function() {
      expect(element[0].querySelector('.card__type').innerHTML).to.equal(template.name);
    });

    it('should display its level', function() {
      expect(element[0].querySelector('.card__level').innerHTML).to.equal('Level ' + template.level);
    });

    it('should display its desc', function() {
      expect(element[0].querySelector('.card__desc').innerHTML).to.equal(template.description);
    });
  });
});
