
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('SocietyEditCtrl', SocietyEditCtrl);

  SocietyEditCtrl.$inject = [ 'NgTableParams', '$document', '$filter', 'societyFactory', '$state', 'validationHelperFactory', '$stateParams', 'toaster'];
  /* @ngInject */
  function SocietyEditCtrl( NgTableParams, $document, $filter, societyFactory, $state, validationHelperFactory, $stateParams , toaster) {
    var vm = this;
    vm.submit = submit;
    vm.reset = reset;

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {
      societyFactory.findSociety($stateParams.id).then(function (response) {
        console.log($stateParams.id)
        if (response.status == 200) {
          vm.society = response.data;
        }
        else if (response.status == -1) {
          toaster.error('Network Error', 'error');
          vm.errorMessage = "Network Error";
          console.error(response);
        }
        else if (response.status == 400) {
          console.error(response);
          vm.errorMessage = vm.master.message;
          toaster.error(vm.master.message, 'error');
        }
        else {
          toaster.error('Some problem', 'error');
          console.error(response);
        }
      });

    };

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    function reset() {
      activate($stateParams.id)
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    function submit() {
      var firstError = null;

      if (vm.Form.$invalid) {

        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        societyFactory.editSociety($stateParams.id, vm.society).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            toaster.info('Society updated');
            $state.go('app.society');
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data.message;
            toaster.error(response.data.message, 'error');
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

