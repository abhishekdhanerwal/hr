(function () {
  'use strict';
  angular
    .module('app')
    .factory('validationHelperFactory', validationHelperFactory);

  // validationHelperFactory.$inject = ['logger'];
  function validationHelperFactory() {
    var service = {};

    service.manageValidationFailed = function (form) {

      var firstError = null;
      var field = null, firstError = null;
      for (field in form) {

        if (field[0] != '$') {
          if (firstError === null && !form[field].$valid) {
            firstError = form[field].$name;
          }

          if (form[field].$pristine) {
            form[field].$dirty = true;
          }
        }
      }
      angular.element('.ng-invalid[name=' + firstError + ']').focus();
      // logger.error('Validation Error', 'error');
    }

    return service;
  };
})();
