(function () {
  'use strict';

  angular
    .module('app.admin')
    .factory('societyFactory', societyFactory);

  societyFactory.$inject = ['$http'];

  function societyFactory($http) {
    var service = {};

    service.newSociety = function (data) {
      var promise = $http.post(__env.dataServerUrl + '/createSociety', data)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.societyList = function () {
      var promise = $http.get(__env.dataServerUrl + '/societies')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.findSociety = function (id) {
      var promise = $http.get(__env.dataServerUrl + '/society/' + id)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.editSociety = function (id,society) {
      var promise = $http.put(__env.dataServerUrl + '/updateSociety/' + id,society)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.flatListBySociety = function (id) {
      var promise = $http.get(__env.dataServerUrl + '/flat/findBySociety?societyId=' + id)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.searchUser = function (val) {
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

