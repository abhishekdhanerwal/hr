(function () {
  'use strict';

  angular
    .module('app.visitors')
    .factory('visitorFactory', visitorFactory);

  visitorFactory.$inject = ['$http', '$localStorage'];

  function visitorFactory($http, $localStorage) {
    var service = {};


    service.addVisitor = function (visitor) {
      var promise = $http.post(__env.dataServerUrl + '/createVisitor', visitor)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.getVisitorType = function () {
      var promise = $http.get(__env.dataServerUrl + '/visitorType')
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

    service.visitorList = function (tower, flatNo) {
      var promise = $http.get(__env.dataServerUrl + '/visitors')
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

    service.searchVisitor = function (mobile) {
      var promise = $http.get(__env.dataServerUrl + '/visitorByMobile?mobile=' + mobile)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.viewvisitor = function (id) {
      var promise = $http.get(__env.dataServerUrl + '/visitor/'  + id)
        .then(
          function (data) {
            console.log(data);
            return data;
          },
          function (errors) {
            console.log(errors);
            return errors;
          });
      return promise;
    };

    service.edit = function (data) {
      var promise = $http.put(__env.dataServerUrl + '/editVisitor', data)
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

