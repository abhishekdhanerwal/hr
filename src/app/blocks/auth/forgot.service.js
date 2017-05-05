(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .factory('forgotFactory', forgotFactory);

  forgotFactory.$inject = ['$http'];

  function forgotFactory($http) {
    var service = {};

    service.abc = function (email) {
      console.log(email);
      var promise = $http.post(__env.uiServerUrl + '/users/forgot_password', email)
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

