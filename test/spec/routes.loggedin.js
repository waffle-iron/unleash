'use strict';

describe('Routes test', function()  {
  beforeEach(module('unleashApp'));

  var location;
  var route;
  var rootScope;

  // @todo Store AuthMock externally
  var AuthMock;

  beforeEach(function() {
    AuthMock = {
      uid: 'test123',
      test: function () {
        console.log('test');
      },
      $getAuth: function() {
        return this.uid;
      },
      $requireAuth: function() {
        return this.uid;
      },
      $waitForAuth: function() {
        return this.uid;
      }
    };

    module(
      function ($provide) {
        $provide.service('googleApi', function() {
          return {
            load: function(callback) {
            }
          }
        });
      }
    );

    inject(
      function (_$location_, _$route_, _$rootScope_, PROFILES_API_URL, $httpBackend) {
        $httpBackend.expectGET(PROFILES_API_URL).respond(200, 'OK');
        location = _$location_;
        route = _$route_;
        rootScope = _$rootScope_;
      });
  });


  describe('profile route logged in', function() {
    beforeEach(inject(
      function($httpBackend) {
        $httpBackend.expectGET('views/home.html')
          .respond(200, 'home HTML');
      }));

    it('should load the single path page', function() {
      location.path('/paths/xxx');
      rootScope.$digest();

      expect(rootScope.postLogInRoute)
        .equal('/paths/xxx/');
    });
  });

  describe('path edit route logged in', function() {
    beforeEach(inject(
      function($httpBackend) {
        $httpBackend.expectGET('views/edit.html')
          .respond(200, 'path edit HTML');
        $httpBackend.expectGET('views/home.html')
          .respond(200, 'home HTML');
      }));

    it('should load the path edit page', function() {
      location.path('/paths/xxx/edit');
      rootScope.$digest();

      expect(rootScope.postLogInRoute)
        .equal('/paths/xxx/edit');
    });
  });
});
