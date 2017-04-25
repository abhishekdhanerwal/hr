
(function () {
  'use strict';

  angular
    .module('app.userMenu')
    .factory('changePasswordFactory', changePasswordFactory);

  changePasswordFactory.$inject = ['$http'];

  function changePasswordFactory($http) {
    var service = {};
    var apiUser = __env.apiUser;

    service.change = function (passData) {
      var promise = $http.put(__env.userServerUrl + '/changePassword', passData)
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
