
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintNewCtrl', ComplaintNewCtrl);

  ComplaintNewCtrl.$inject = [ 'NgTableParams', '$filter', 'complaintFactory', 'validationHelperFactory'];
  /* @ngInject */
  function ComplaintNewCtrl( NgTableParams, $filter, complaintFactory, validationHelperFactory) {
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

      vm.complaint.type = '';
      vm.complaint.text = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    function submit() {
      console.log('l')
      var firstError = null;

      if (vm.Form.complaintType.$invalid || vm.Form.complaintText.$invalid) {

        validationHelperFactory.manageValidationFailed(vm.form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        complaintFactory.newComplaint(vm.data).then(function (response) {
          console.log(vm.data);

          if (response.status == 201) {
            // logger.info('Complaint registered', 'default');
            $state.go('app.complaint');
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            // logger.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data[0].message;
            // logger.error(response.data[0].message, 'error');
            console.error(response);
          }
          else {
            vm.errorMessage = 'Some problem';
            // logger.error('Some problem', 'error');
            console.error(response);
          }
          vm.resetDisabled = false;
          vm.submitDisabled = false;
        });
      }
    };
  }
})();

