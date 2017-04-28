
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintNewCtrl', ComplaintNewCtrl);

  ComplaintNewCtrl.$inject = [ 'NgTableParams', '$filter', 'complaintFactory', '$state', 'validationHelperFactory', 'toaster'];
  /* @ngInject */
  function ComplaintNewCtrl( NgTableParams, $filter, complaintFactory, $state, validationHelperFactory , toaster) {
    var vm = this;
    vm.submit = submit;
    vm.reset = reset;

    activate();

    function activate() {
      complaintFactory.loadTypeDetails().then(function (response) {
        vm.complaintType = response.data;
        console.log(vm.complaintType)
      })
    };

    function reset() {
      vm.complaint = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    function submit() {
      var firstError = null;

      if (vm.Form.complaintType.$invalid || vm.Form.complaintText.$invalid) {

        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        complaintFactory.newComplaint(vm.complaint).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            console.log('ab')
            toaster.info('Complaint registered');
            $state.go('app.complaint');
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data[0].message;
            toaster.error(response.data[0].message, 'error');
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

