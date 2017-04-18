
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .factory('complaintFactory', complaintFactory);

  complaintFactory.$inject = ['$http'];

  function complaintFactory($http) {
    var service = {};
    // var apiUser = __env.apiUser;

    service.loadTypeDetails = function () {
      var promise = $http.get(__env.dataServerUrl + '/complaint/complaintType')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.getComplaintDetails = function () {
      var promise = $http.get(__env.dataServerUrl + '/complaint')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.newComplaint = function (data) {
      var promise = $http.post(__env.dataServerUrl + '/complaint', data)
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

