
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
      var promise = $http.get(__env.dataServerUrl + '/complaintType')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.loadStatusDetails = function () {
      var promise = $http.get(__env.dataServerUrl + '/complaintStatus')
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

    service.getComplaintByUser = function () {
      var promise = $http.get(__env.dataServerUrl + '/complaint/findByUser')
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

    service.userByComplaintType = function (data) {
      var promise = $http.get(__env.dataServerUrl + '/userByComplaintType?complaintType='+ data)
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
      var promise = $http.post(__env.dataServerUrl + '/createComplaint', data)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.findComplaint = function (id) {
      var promise = $http.get(__env.dataServerUrl + '/complaint/' + id)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.editComplaint = function (id, complaint) {
      var promise = $http.put(__env.dataServerUrl + '/editComplaint/' + id, complaint)
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

