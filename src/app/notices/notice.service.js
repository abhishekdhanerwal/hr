(function () {
  'use strict';

  angular
    .module('app.notice')
    .factory('noticeFactory', noticeFactory);

  noticeFactory.$inject = ['$http'];

  function noticeFactory($http) {
    var service = {};

    service.newNotice = function (data) {
      var promise = $http.post(__env.dataServerUrl + '/createNotice', data)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.updateNotice = function (data , noticeId) {
      var promise = $http.put(__env.dataServerUrl + '/notice/'+noticeId, data)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.getSociety = function(data){
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

    service.getSocietyUser = function(){
      var promise = $http.get(__env.dataServerUrl + '/usersByRole')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.getNotices = function(){
      var promise = $http.get(__env.dataServerUrl + '/notice')
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.addReadRecipient = function(noticeId , user){
      var promise = $http.put(__env.dataServerUrl + '/addReadRecipient/'+ noticeId , user)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.deleteNotice = function(noticeId){
      var promise = $http.put(__env.dataServerUrl + '/notice/toggleStatus/'+ noticeId)
        .then(
          function (response) {
            return response;
          },
          function (response) {
            return response;
          });
      return promise;
    };

    service.editNotice = function(noticeId){
      var promise = $http.get(__env.dataServerUrl + '/getNotice/'+ noticeId)
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

