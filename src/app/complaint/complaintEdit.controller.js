
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintEditCtrl', ComplaintEditCtrl);

  ComplaintEditCtrl.$inject = [ 'NgTableParams', '$filter', 'complaintFactory', '$state', 'validationHelperFactory', '$stateParams', 'toaster'];
  /* @ngInject */
  function ComplaintEditCtrl( NgTableParams, $filter, complaintFactory, $state, validationHelperFactory, $stateParams , toaster) {
    var vm = this;
    vm.submit = submit;
    vm.reset = reset;
    vm.populateAssignToList = populateAssignToList;

    activate();

    function activate() {
      complaintFactory.findComplaint($stateParams.id).then(function (response) {
        if (response.status == 200) {
          vm.master = response.data;
          vm.complaint = angular.copy(vm.master)
          console.log(vm.master)
          console.log(vm.complaint.assignedTo.name)
        }
        else if (response.status == -1) {
          toaster.error('Network Error', 'error');
          vm.errorMessage = "Network Error";
          console.error(response);
        }
        else if (response.status == 400) {
          console.error(response);
          vm.errorMessage = vm.master[0].message;
          toaster.error(vm.master[0].message, 'error');
        }
        else {
          toaster.error('Some problem', 'error');
          console.error(response);
        }
      });

      complaintFactory.loadTypeDetails().then(function (response) {
        vm.complaintType = response.data;
        console.log(vm.complaintType)
      });

      complaintFactory.loadStatusDetails().then(function (response) {
        vm.status = response.data;
      });

    };

    function populateAssignToList(){
      complaintFactory.userByComplaintType(vm.complaint.complaintType).then(function (response) {
        vm.assignTo = response.data;
        console.log(vm.assignTo)
      });
    }

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

        complaintFactory.editComplaint($stateParams.id, vm.complaint).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            toaster.info('Complaint updated');
            $state.go('app.complaint');
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

