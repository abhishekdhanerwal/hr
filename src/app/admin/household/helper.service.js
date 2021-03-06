(function () {
  'use strict';

  angular
    .module('app.admin')
    .factory('helperFactory', helperFactory);

  helperFactory.$inject = ['$http'];

  function helperFactory($http) {
    var service = {};

    service.helperType = function () {
      var promise = $http.get(__env.dataServerUrl + '/helperType')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.searchFlatno = function (val) {
      var promise = $http.get(__env.dataServerUrl + '/flatNumber/search?query=' + val)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.newHelper = function (data) {
      var promise = $http.post(__env.dataServerUrl + '/createHelper' , data)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.helperList = function () {
      var promise = $http.get(__env.dataServerUrl + '/helpers')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.findHelper = function (id) {
      var promise = $http.get(__env.dataServerUrl + '/helper/view/' + id)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.editHelper = function (id, data) {
      var promise = $http.put(__env.dataServerUrl + '/updateHelper?helperId=' + id,data)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.addHelperForConsumer = function (helperNo) {
      var promise = $http.put(__env.dataServerUrl + '/updateHelper?helperNo=' + helperNo)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.removeHelper = function (helperNo) {
      var promise = $http.put(__env.dataServerUrl + '/helper/remove/' + helperNo)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.helperListForConsumer = function () {
      var promise = $http.get(__env.dataServerUrl + '/helper/consumer')
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

