(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .factory('principal', principal);

  principal.$inject = ['$q', '$http', '$timeout', 'toaster', '$localStorage' , '$rootScope', 'role'];

  /* @ngInject */
  function principal($q, $http, $timeout, toaster, $localStorage , $rootScope, role) {
    var _identity = undefined;
    var _authenticated = false;

    var service = {
      //authenticate: authenticate,
      identity: identity,
      isAuthenticated: isAuthenticated,

      //isIdentityResolved: isIdentityInLocalStorage,
      isInAnyRole: isInAnyRole,
      isInRole: isInRole,

      signin: signin,
      signout: signout

    };
    return service;

    function identity(force) {
      var deferred = $q.defer();
      if (force === true) {
        clearLocalStorage();
      }
      // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
      if (isIdentityInLocalStorage()) {
        if (isAuthenticated()) {
          deferred.resolve($localStorage._identity);
        }
        else {
          $http.post(__env.dataServerUrl + '/session/refresh', {refreshToken: $localStorage._identity.refresh_token})
            .then(function (response) {
                if (response.status == 200) {
                  $localStorage._identity = response.data;
                  $localStorage.loggedInTimeStamp = Date.now();
                  //_authenticated = true;
                  $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage._identity.access_token;
                  deferred.resolve($localStorage._identity);
                }
                else {
                  clearLocalStorage();
                  //_authenticated = false;
                  deferred.reject("Session Expired");
                }
              },
              function (response) {
                clearLocalStorage();
                //_authenticated = false;
                deferred.reject("Error connecting server");
              });
        }
      }
      else {
        deferred.reject("Signin required");
      }
      return deferred.promise;
    }
    function isAuthenticated() {
      if (isIdentityInLocalStorage()) {
        var currentTimeStamp = Date.now();
        var loggedInTimeStamp = $localStorage.loggedInTimeStamp;
        var expiryTimePeriod = $localStorage._identity.expires_in * 1000;//in seconds as rest of things are in milliseconds
        if ((currentTimeStamp - loggedInTimeStamp) < expiryTimePeriod) {
          return true;
        }
        else {
          return false;
        }
      }
    }

    function isIdentityInLocalStorage() {
      return angular.isDefined($localStorage._identity);
    }

    function isInAnyRole() {
      //TODO Below implementation need to be changed. Should get data from _identity.userDetails object
      return true;
    }

    function isInRole() {
      // TODO Below implementation need to be changed. Should get data from _identity.userDetails object
      return true;
    }

    function clearLocalStorage() {
      if (isIdentityInLocalStorage()) {
        $localStorage.$reset();
        // delete $localStorage._identity;
        // delete $localStorage.loggedInTimeStamp;
      }
    }

    function signin(user, password) {
      var deferred = $q.defer();
      var headers = {
        authorization : "Basic "
        + btoa(user + ":"
          + password)
      }
      $http.get(__env.dataServerUrl + '/login', {
        headers : headers
      }).then(function(response) {
        if(response.status == 200){
          $localStorage._identity = response.data;
          console.log($localStorage._identity)
          $localStorage.loggedInTimeStamp = Date.now();
          _identity = response.data.principal.user;
          _authenticated = true;
          // $rootScope.currentUser =  _identity.principal.user;
          // deferred.resolve(_identity);
          deferred.resolve($localStorage._identity);
        }
        else {
          clearLocalStorage();
          //_authenticated = false;
          deferred.reject("Invalid Login credentials");
        }
        },
        function (response) {
          _identity = null;
          _authenticated = false;
          deferred.reject(_identity);
            toaster.error("Login Failed");
        });

      return deferred.promise;
    }

    function signout() {
      var deferred = $q.defer();
      $http.post(__env.dataServerUrl + '/logout', {}).finally(function() {
        deferred.resolve(_identity);
      });
      $rootScope.currentUser = null;
      _identity = null;
      _authenticated = false;
      clearLocalStorage();
      return deferred.promise;
    }
  }

})();


