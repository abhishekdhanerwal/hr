
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintNewCtrl', ComplaintNewCtrl);

  ComplaintNewCtrl.$inject = [ 'NgTableParams', '$filter', '$document', 'role', 'complaintFactory', '$state', 'validationHelperFactory', 'toaster', '$localStorage'];
  /* @ngInject */
  function ComplaintNewCtrl( NgTableParams, $filter, $document, role, complaintFactory, $state, validationHelperFactory , toaster, $localStorage) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.searchFlat = searchFlat;
    vm.onSelect = onSelect;
    vm.clearFlat = clearFlat;
    vm.submit = submit;
    vm.reset = reset;
    vm.disableFlat = true;

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
      vm.isMeterManagementRole = role.isMeterManagementRole();

      complaintFactory.getTowerList($localStorage._identity.principal.societyId).then(function (response) {
        vm.towerList = response.data;
      })

      complaintFactory.flatList().then(function (response) {
        if(response.status == 200) {
          vm.flat = response.data;
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      })

      complaintFactory.loadTypeDetails().then(function (response) {
        if(response.status == 200) {
          vm.complaintType = response.data;
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      })
    };

    vm.disableFlatInput = function(){
      vm.disableFlat = false;
    }

    vm.populateAssignToList = function(){
      complaintFactory.userByComplaintType(vm.complaint.complaintType).then(function (response) {
        if(response.status == 200) {
          vm.assignTo = response.data;
          // if(vm.complaint.complaintType == 'Meter'){
          //   vm.complaint.assignedTo = 'Deepak';
          // }
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });
    }

    function searchFlat(val){
      return complaintFactory.searchFlat(val, vm.tower).then(function (response) {
        if(response.status == 200) {
          console.log(response)
          var params = {
            query: val
          };
          return response.data.map(function (item) {
            return item;
          })
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });
    }

    function onSelect($item, $model, $label) {
      vm.complaint.address.tower = $item.tower;
      vm.complaint.address.flat = $item.flat;
    };

    function clearFlat(){
      vm.complaint.registerFor = '';
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

