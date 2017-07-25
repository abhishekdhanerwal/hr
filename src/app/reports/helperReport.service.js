(function () {
  'use strict';

  angular
    .module('app.reports')
    .factory('helperReportFactory', helperReportFactory);

  helperReportFactory.$inject = ['$http'];

  function helperReportFactory($http) {
    var service = {};
    var apiUser = __env.apiUser;

    service.getReports = function (status, start, end, id) {
      var promise = $http.get(__env.dataServerUrl + '/complaint/reports?status=' + status + '&fromDate=' + start.toISOString() + '&toDate=' + end.toISOString() + '&societyId=' +id)
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


    return service;
  };
}());
