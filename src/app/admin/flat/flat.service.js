(function () {
  'use strict';

  angular
    .module('app.admin')
    .factory('flatFactory', flatFactory);

  flatFactory.$inject = ['$http'];

  function flatFactory($http) {
    var service = {};

    service.newFlat = function (id,data) {
      var promise = $http.post(__env.dataServerUrl + '/createFlat/' +id ,data)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.residentType = function () {
      var promise = $http.get(__env.dataServerUrl + '/flat/residentType')
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

    service.flatList = function () {
      var promise = $http.get(__env.dataServerUrl + '/flats')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.findFlat = function (id) {
      var promise = $http.get(__env.dataServerUrl + '/flat/' + id)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.editFlat = function (id,flat) {
      var promise = $http.put(__env.dataServerUrl + '/updateFlat/' + id,flat)
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

