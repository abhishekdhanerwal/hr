
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
    vm.clearFlat = clearFlat;

    activate();

    function activate() {
      complaintFactory.findComplaint($stateParams.id).then(function (response) {
        if (response.status == 200) {
          vm.master = response.data;
          vm.complaint = angular.copy(vm.master)
          console.log(vm.master)
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
      });

      vm.list = ['1', '2']
      vm.list.map(function(item)
      {
        return item;
        console.log(item)
      });
      vm.flatList = vm.list;

    };

    function clearFlat(){
      vm.complaint.address = '';
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
            console.log('ab')
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
