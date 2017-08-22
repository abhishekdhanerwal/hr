(function () {
  'use strict';

  angular
    .module('app.reports')
    .factory('helperReportFactory', helperReportFactory);

  helperReportFactory.$inject = ['$http'];

  function helperReportFactory($http) {
    var service = {};
    var apiUser = __env.apiUser;

    service.getHelperReport = function (helperNo) {
      var promise = $http.get(__env.dataServerUrl + '/helper/reports?helperNo=' + helperNo)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.getHelperReportByName = function (name) {
      var promise = $http.get(__env.dataServerUrl + '/helper/reports?name=' + name)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.getWorkingHelperReport = function (isWorking) {
      var promise = $http.get(__env.dataServerUrl + '/helper/reports?isWorking=' + isWorking)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.getHelperName = function (name) {
      var promise = $http.get(__env.dataServerUrl + '/helperName/search?query=' + name)
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

    service.getFlatHelperReports = function (tower, flatNo) {
        var promise = $http.get(__env.dataServerUrl + '/helper/reports?tower=' + tower + '&flatNo=' + flatNo)
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