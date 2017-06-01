
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintEditCtrl', ComplaintEditCtrl);

  ComplaintEditCtrl.$inject = [ 'NgTableParams', '$filter', '$document', 'complaintFactory', '$state', 'validationHelperFactory', '$stateParams', 'toaster', 'role'];
  /* @ngInject */
  function ComplaintEditCtrl( NgTableParams, $filter, $document, complaintFactory, $state, validationHelperFactory, $stateParams , toaster, role) {
    var vm = this;
    vm.submit = submit;
    vm.reset = reset;
    vm.populateAssignToList = populateAssignToList;
    vm.changeStatus = changeStatus;

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {
      vm.isAdminRole = role.isAdminRole();
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isConsumerRole = role.isConsumerRole();

      complaintFactory.flatList().then(function (response) {
        vm.flat = response.data;
        console.log(vm.flat)
        getEditInfo();
      });

      complaintFactory.loadTypeDetails().then(function (response) {
        vm.complaintType = response.data;
        console.log(vm.complaintType)
      });

      complaintFactory.loadStatusDetails().then(function (response) {
        vm.status = response.data;
        console.log(vm.status)
        getEditInfo();
      });

    };

    function changeStatus(){
      if(!vm.isConsumerRole && vm.complaint.status == 'New'){
        vm.complaint.status = 'In_Progress';
      }
    }

    function getEditInfo(){
      complaintFactory.findComplaint($stateParams.id).then(function (response) {
        if (response.status == 200) {
          vm.master = response.data;
          vm.complaint = angular.copy(vm.master)
          if(vm.isConsumerRole && vm.complaint.status == 'New'){
            vm.status.splice(1,4);
          }
          else if(vm.isConsumerRole && vm.complaint.status == 'In_Progress'){
            vm.status.splice(-1,-2);
            console.log(vm.status);
          }
          else if(vm.isConsumerRole && vm.complaint.status == 'Resolved'){
            vm.status.splice(0,1);
          }
          else if(vm.isConsumerRole && vm.complaint.status == 'Re_Opened'){
            vm.status.splice(0,1);
            //vm.status.splice(1,1);
          }
          else if(vm.isConsumerRole && vm.complaint.status == 'Closed'){
            vm.status.splice(0,2);
          }
          populateAssignToList(vm.complaint.complaintType);
          console.log(vm.complaint)
          for(var index = 0 ; index < vm.flat.length ; index++){
            if(vm.complaint.registerFor.id == vm.flat[index].id){
              vm.complaint.registerFor = vm.flat[index];
            }
          };
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
    }

    function populateAssignToList(complaintType){
      complaintFactory.userByComplaintType(complaintType).then(function (response) {
        vm.assignTo = response.data;
        console.log(vm.assignTo)
        console.log(vm.complaint.assignedTo)
        if(vm.complaint.assignedTo != null) {
          for (var index = 0; index < vm.assignTo.length; index++) {
            if (vm.complaint.assignedTo.id == vm.assignTo[index].id) {
              vm.complaint.assignedTo = vm.assignTo[index];
              console.log(vm.complaint.assignedTo)
            }
          }
        }
        else{

        }
      });
    }

    function reset() {
      activate($stateParams.id)
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

        complaintFactory.editComplaint($stateParams.id, vm.complaint).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            toaster.info('Complaint updated');
            vm.message = "Complaint updated";
            $state.go('app.complaint',{msg:vm.message});
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

