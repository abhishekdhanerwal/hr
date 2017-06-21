
(function () {
  'use strict';

  angular
    .module('app.userMenu')
    .factory('userProfileFactory', userProfileFactory);

  userProfileFactory.$inject = ['$http', '$localStorage'];

  function userProfileFactory($http, $localStorage) {
    var service = {};

    service.edit = function (userID, data) {
      console.log(userID)
      var promise = $http.put(__env.dataServerUrl + '/editUser/' + userID, data)
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
            console.log(errors);
            return errors;
          });
      return promise;
    };

    service.userAddress = function (userID) {
      var promise = $http.get(__env.dataServerUrl + '/flatByUser/'  + userID)
        .then(
          function (data) {
            console.log(data);
            return data;
          },
          function (errors) {
            console.log(errors);
            return errors;
          });
      return promise;
    };

    return service;
  };

}());
