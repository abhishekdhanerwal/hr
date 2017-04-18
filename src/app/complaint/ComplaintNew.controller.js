
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
    vm.clearFlat = clearFlat;

    activate();

    function activate() {
      complaintFactory.loadTypeDetails().then(function (response) {
        vm.complaintType = response.data;
        console.log(vm.complaintType)
      })

      vm.list = ['1', '2']
      vm.list.map(function(item)
      {
        return item;
        console.log(item)
      });
      vm.flatList = vm.list;
      console.log(vm.flatList)

    };

    function clearFlat(){
      vm.complaint = {};
    }

    function reset() {
      vm.complaint.type = '';
      vm.complaint.text = '';
      vm.complaint.flat = '';
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

