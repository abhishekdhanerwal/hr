(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .factory('forgotFactory', forgotFactory);

  forgotFactory.$inject = ['$http'];

  function forgotFactory($http) {
    var service = {};

    service.forgetPwd = function (phoneNo) {
      console.log(phoneNo);
      var promise = $http.post(__env.dataServerUrl + '/forgotPassword?phoneNo=' + phoneNo)
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

