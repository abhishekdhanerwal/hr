
(function () {
  'use strict';

  angular
    .module('app.userMenu')
    .factory('userProfileFactory', userProfileFactory);

  userProfileFactory.$inject = ['$http', '$localStorage'];

  function userProfileFactory($http, $localStorage) {
    var service = {};

    service.edit = function (userID) {
      console.log(user)
      console.log(userID)
      var promise = $http.post(__env.dataServerUrl + '/editUser/' + userID)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.viewuser = function (userID) {
      var promise = $http.get(__env.dataServerUrl + '/users/'  + userID)
        .then(
          function (data) {
            console.log(data);
            return data;
          },
          function (errors) {
            console.log("data error service.getAll : ");
            console.log(errors);
            return errors;
          });
      return promise;
    };

    service.alluser = function () {
      var promise = $http.get(__env.dataServerUrl + '/users')
        .then(
          function (data) {
            console.log(data);
            return data;
          },
          function (errors) {
            console.log("data error service.getAll : ");
            console.log(errors);
            return errors;
          });
      return promise;
    };

    return service;
  };

}());
