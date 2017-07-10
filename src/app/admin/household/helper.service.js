(function () {
  'use strict';

  angular
    .module('app.admin')
    .factory('helperFactory', helperFactory);

  helperFactory.$inject = ['$http'];

  function helperFactory($http) {
    var service = {};

    service.helperType = function () {
      var promise = $http.get(__env.dataServerUrl + '/helperType')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.searchFlatno = function (val) {
      var promise = $http.get(__env.dataServerUrl + '/flatNumber/search?query=' + val)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.newHelper = function (data) {
      var promise = $http.post(__env.dataServerUrl + '/createHelper' , data)
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

