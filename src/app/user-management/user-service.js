(function () {
  'use strict';

  angular
    .module('app.user')
    .factory('userFactory', userFactory);

  userFactory.$inject = ['$http', '$localStorage'];

  function userFactory($http, $localStorage) {
    var service = {};


    service.save = function (user) {
      console.log(user);
      var promise = $http.post(__env.dataServerUrl + '/createUser', user)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.getRole = function () {
      var promise = $http.get(__env.dataServerUrl + '/user/roles')
        .then(
          function (response) {
            console.log(response)
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.alluser = function () {
      var promise = $http.get(__env.dataServerUrl + '/users')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.finduser = function (id) {
      var promise = $http.get(__env.dataServerUrl + '/users/' + id)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.update = function (id, user) { // TODO below need to be changed
      var promise = $http.put(__env.dataServerUrl + '/editUser/' + id, user)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    return service;
  };
}());

