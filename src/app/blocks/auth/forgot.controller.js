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
        forgotFactory.forgetPwd(vm.phoneNo).then(function (response) {

          if (response.status == 200) {
            toaster.info('Message Sent');
            $state.go('auth.signin');
          }
          else if (response.status == -1) {
            toaster.set('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            toaster.info(response.data[0].message);
            console.error(response);
          }
          else if( response.status == 401){
            toaster.info("User is not logged in. Redirecting to Login Page");
            $state.go('auth.signout')
          }
          else {
            toaster.error(response.data[0].message);
          }
        });

      }
    }

  }

}());

