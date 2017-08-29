(function () {
  'use strict';

  angular
    .module('app.neighbours')
    .factory('neighbourFactory', neighbourFactory);

  neighbourFactory.$inject = ['$http'];

  function neighbourFactory($http) {
    var service = {};

    service.neighbourListByName = function (neighbourName) {
      var promise = $http.get(__env.dataServerUrl + '/flat/findByUserName?name=' + neighbourName)
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

    service.neighbourListByFlat = function (tower,flatNo) {
      var promise = $http.get(__env.dataServerUrl + '/user/userByFlat?tower=' + tower + '&flatNo=' + flatNo)
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

    service.searchNeighboursByName = function (val) {
      var promise = $http.get(__env.dataServerUrl + '/users/search?query=' + val)
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

