(function () {
  'use strict';

  angular
    .module('app.reports')
    .factory('complaintReportFactory', complaintReportFactory);

  complaintReportFactory.$inject = ['$http'];

  function complaintReportFactory($http) {
    var service = {};
    var apiUser = __env.apiUser;

    service.getReports = function (status, start, end) {
      var promise = $http.get(__env.dataServerUrl + '/complaint/reports?status=' + status + '&fromDate=' + start.toISOString() + '&toDate=' + end.toISOString())
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


    return service;
  };
}());
