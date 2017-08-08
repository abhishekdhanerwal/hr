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

    service.visitorList = function () {
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

    service.finduser = function (id) {
      var promise = $http.get(__env.dataServerUrl + '/users/' + id)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.userAddress = function (userID) {
      var promise = $http.get(__env.dataServerUrl + '/flatByUserId/'  + userID)
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

    service.update = function (id, user) {
      var promise = $http.put(__env.dataServerUrl + '/editUser/' + id, user)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.changeStatus = function (id) {
      var promise = $http.put(__env.dataServerUrl + "/users/toggleStatus/" + id)
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

    return service;
  };
}());

