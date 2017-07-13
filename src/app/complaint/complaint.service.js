
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
      var promise = $http.get(__env.dataServerUrl + '/complaints')
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

    service.searchFlat = function (val, tower) {
      var promise = $http.get(__env.dataServerUrl + '/flat/' +tower+ '/search?query=' + val)
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
      var promise = $http.get(__env.dataServerUrl + '/flatsWithResident')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.getComplaintByUser = function (id) {
      var promise = $http.get(__env.dataServerUrl + '/complaint/findByUser?societyId=' +id)
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

    service.getResolvedComplaintByUser = function (status) {
      var promise = $http.get(__env.dataServerUrl + '/complaint/findByUser?status=Resolved')
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

    service.getClosedComplaintByUser = function (status) {
      var promise = $http.get(__env.dataServerUrl + '/complaint/findByUser?status=Closed')
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

