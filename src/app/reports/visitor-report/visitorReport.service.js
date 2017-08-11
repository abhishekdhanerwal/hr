(function () {
  'use strict';

  angular
    .module('app.reports')
    .factory('visitorReportFactory', visitorReportFactory);

  visitorReportFactory.$inject = ['$http'];

  function visitorReportFactory($http) {
    var service = {};
    var apiUser = __env.apiUser;

    service.getReports = function (start, end, tower, flatNo) {
        var promise = $http.get(__env.dataServerUrl + '/visitor/reports?fromDate=' + start.toISOString() + '&toDate=' + end.toISOString() + '&tower=' + tower + '&flatNo=' + flatNo)
          .then(
            function (response) {
              return response;
            },
            function (response) {
              return response;
            });
        return promise;
    };

    service.getTowerList = function (societyId) {
      var promise = $http.get(__env.dataServerUrl + '/society/' + societyId + '/towers')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.findAllFlats = function (tower) {
      var promise = $http.get(__env.dataServerUrl + '/tower/' + tower + '/flat')
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
