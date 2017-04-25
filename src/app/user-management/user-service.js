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

    service.createUser = function () { // TODO below need to be changed
      var promise = $http.post(__env.dataServerUrl + '/createUser')
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
      var promise = $http.post(__env.userServerUrl + '/editUser/' + id, user)
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

