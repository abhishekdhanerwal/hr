
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintNewCtrl', ComplaintNewCtrl);

  ComplaintNewCtrl.$inject = [ 'NgTableParams', '$filter', '$document', 'role', 'complaintFactory', '$state', 'validationHelperFactory', 'toaster'];
  /* @ngInject */
  function ComplaintNewCtrl( NgTableParams, $filter, $document, role, complaintFactory, $state, validationHelperFactory , toaster) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.submit = submit;
    vm.reset = reset;

    function breadcrumbRoute() {
      $state.go('app.notice')
    }

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {
      vm.isAdminRole = role.isAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isConsumerRole = role.isConsumerRole();

      complaintFactory.flatList().then(function (response) {
        if(response.status == 200) {
          vm.flat = response.data;
          console.log(vm.flat)
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      })

      complaintFactory.loadTypeDetails().then(function (response) {
        if(response.status == 200) {
          vm.complaintType = response.data;
          console.log(vm.complaintType)
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      })
    };

    vm.populateAssignToList = function(){
      complaintFactory.userByComplaintType(vm.complaint.complaintType).then(function (response) {
        if(response.status == 200) {
          vm.assignTo = response.data;
          console.log(vm.assignTo)
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });
    }

    function reset() {
      vm.complaint = '';
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

        complaintFactory.newComplaint(vm.complaint).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            toaster.info('Complaint registered');
            vm.message = "Complaint registered";
            $state.go('app.complaint', {msg: vm.message});
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
          else if( response.status == 401){
            toaster.info("User is not logged in. Redirecting to Login Page");
            $state.go('auth.signout')
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

