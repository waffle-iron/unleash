'use strict';

describe('Directive: unleashAchieve', function () {

  // load the directive's module
  beforeEach(module('unleashApp'));

  var element,
    scope;

  beforeEach(inject(function ($window, FBURL, $firebase, $compile, $rootScope) {
    scope = $rootScope.$new();
    scope.card = {};

    element = angular.element('<button unleash-achieve></button>');
    element = $compile(element)(scope);

    scope.$apply();
  }));

  it('should render a proper default button text', inject(function () {
    expect(element.text()).toBe('Mark as achieved');
  }));
});
