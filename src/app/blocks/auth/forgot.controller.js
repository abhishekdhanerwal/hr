(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .controller('ForgotController', ForgotController);

  ForgotController.$inject = ['$q', 'forgotFactory', '$state', 'toaster', 'validationHelperFactory'];

  function ForgotController($q, forgotFactory, $state, toaster, validationHelperFactory) {
    var vm = this;

    vm.submit = function () {
      var firstError = null;
      if (vm.Form.$invalid) {
        validationHelperFactory.manageValidationFailed(vm.Form);
        return;
      }
      else {
        forgotFactory.abc(vm.email).then(function (response) {

          if (response.status == 200) {
            toaster.info('Email Sent', 'default');
            $state.go('auth.signin');
          }
          else if (response.status == -1) {
            toaster.set('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            toaster.info(response.data[0].message, 'error');
            console.error(response);
          } else if (response.status == 404) {
            toaster.error(response.data[0].message, 'error');
          }
          else {
            toaster.set(response.data[0].message, 'error');
            console.error(response);
          }
        });

      }
    }

  }

}());

