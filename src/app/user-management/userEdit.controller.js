
(function () {
  'use strict';

  angular
    .module('app.user')
    .controller('UserEditCtrl', UserEditCtrl);

  UserEditCtrl.$inject = ['userFactory', '$document', '$state', 'validationHelperFactory', '$stateParams', 'toaster'];
  /* @ngInject */
  function UserEditCtrl( userFactory, $document, $state, validationHelperFactory, $stateParams , toaster) {
    var vm = this;
    vm.submit = submit;
    vm.reset = reset;

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {

      userFactory.getRole().then(function (response) {
        vm.roles = response.data;
      });


      userFactory.finduser($stateParams.id).then(function (response) {
        if (response.status == 200) {
          vm.user = response.data;
          console.log(vm.user.role)
        }
        else if (response.status == -1) {
          toaster.error('Network Error');
          vm.errorMessage = "Network Error";
          console.error(response);
        }
        else if (response.status == 400) {
          console.error(response);
          vm.errorMessage = vm.master.message;
          toaster.error(vm.master.message);
        }
        else {
          toaster.error('Some problem', 'error');
          console.error(response);
        }
      });

    };

    function reset() {
      vm.user = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    function submit() {
      var firstError = null;

      if (vm.Form.$invalid) {

        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        userFactory.update($stateParams.id, vm.user).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            toaster.info('User updated');
            $state.go('app.allUsers');
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data[0].message;
            toaster.error(response.data[0].message);
            console.error(response);
          }
          else {
            vm.errorMessage = 'Some problem';
            toaster.error('Some problem', 'error');
            console.error(response);
          }
          vm.resetDisabled = false;
          vm.submitDisabled = false;
        });
      }
    };
  }
})();

