'use strict';

describe('Routes test', function()  {
  beforeEach(module('unleashApp'));

  beforeEach(module(function($provide) {
    $provide.service('googleApi', function() {
      return {
        load: function(callback) {
        }
      }
    });
  }));

  var location;
  var route;
  var rootScope;

  beforeEach(inject(
    function (_$location_, _$route_, _$rootScope_) {
      location = _$location_;
      route = _$route_;
      rootScope = _$rootScope_;
    }));

  describe('index route', function() {
    beforeEach(inject(
      function($httpBackend) {
        $httpBackend.expectGET('views/home.html')
          .respond(200, 'main HTML');
      }));


    it('should load the index page on successful load of /', function() {
      location.path('/');
      rootScope.$digest();

      expect(route.current.className)
        .equal('home');
    });

    it('should redirect to the index path on non-existent route', function() {
      location.path('/definitely/not/a/_route');
      rootScope.$digest();

      expect(route.current.className)
        .equal('home');
    });
  });

  describe('profile route logged out', function() {
    beforeEach(inject(
      function($httpBackend) {
        $httpBackend.expectGET('views/home.html')
          .respond(200, 'home HTML');
      }));

    it('should load the home path page', function() {
      location.path('/paths/xxx');
      rootScope.$digest();

      expect(route.current.className)
        .equal('home');
    });
  });

  describe('path edit route logged out', function() {
    beforeEach(inject(
      function($httpBackend) {
        $httpBackend.expectGET('views/home.html')
          .respond(200, 'home HTML');
      }));

    it('should load the home path page', function() {
      location.path('/paths/xxx/edit');
      rootScope.$digest();

      expect(rootScope.postLogInRoute)
        .equal('/paths/xxx/edit');
    });
  });
});
