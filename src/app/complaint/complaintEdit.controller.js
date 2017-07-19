
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintEditCtrl', ComplaintEditCtrl);

  ComplaintEditCtrl.$inject = [ 'NgTableParams', '$filter', '$document', 'complaintFactory', '$state', 'validationHelperFactory', '$stateParams', '$localStorage', 'toaster', 'role'];
  /* @ngInject */
  function ComplaintEditCtrl( NgTableParams, $filter, $document, complaintFactory, $state, validationHelperFactory, $stateParams , $localStorage, toaster, role) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.progress = true;
    vm.submit = submit;
    vm.reset = reset;
    vm.searchFlat = searchFlat;
    vm.onSelect = onSelect;
    vm.populateAssignToList = populateAssignToList;
    vm.changeStatus = changeStatus;

    function breadcrumbRoute() {
      if(vm.isSuperAdminRole || vm.isMeterManagementRole) {
        $state.go('app.complaint')
      }
      else if(vm.isCreatorRole){
        $state.go('app.society')
      }
      else{
        $state.go('app.notice')
      }
    }

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {
      vm.isAdminRole = role.isAdminRole();
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isConsumerRole = role.isConsumerRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isCreatorRole = role.isCreatorRole();
      vm.isMeterManagementRole = role.isMeterManagementRole();

      complaintFactory.getTowerList($localStorage._identity.principal.societyId).then(function (response) {
        vm.progress = false;
        console.log(response.data);
        vm.towerList = response.data
      })

      // complaintFactory.flatList().then(function (response) {
      //   if(response.status == 200) {
      //     vm.flat = response.data;
      //     console.log(vm.flat)
      //     getEditInfo();
      //   }
      //   else if( response.status == 401){
      //     $state.go('auth.signout')
      //   }
      // });

      complaintFactory.loadTypeDetails().then(function (response) {
        if(response.status == 200) {
          vm.progress = false;
          vm.complaintType = response.data;
          console.log(vm.complaintType)
        }
        else if( response.status == 401){
          vm.progress = false;
          $state.go('auth.signout')
        }
      });

      complaintFactory.loadStatusDetails().then(function (response) {
        if(response.status == 200) {
          vm.progress = false;
          vm.status = response.data;
          vm.statusList = [];
          for(var index=0 ; index<vm.status.length ; index++){
            var temp = vm.status[index].split("_");
            if(temp.length > 1){
              console.log(temp)
              var newTemp = "";
              for(var j=0 ; j<temp.length ; j++){
                newTemp = newTemp + temp[j] + " ";
              }
              vm.statusList.push(newTemp);
            }
            else
              vm.statusList.push(vm.status[index]);
          }
          if(vm.isAdminRole || vm.isManagementRole || vm.isConsumerRole){
            for(var i=0; i<vm.status.length; i++){
              if(vm.status[i] == 'All'){
                vm.statusList.splice(i,1);
                vm.status.splice(i,1);
              }
            }
          }
          getEditInfo();
        }
        else if( response.status == 401){
          vm.progress = false;
          $state.go('auth.signout')
        }
      });

    };

    function searchFlat(val){
      return complaintFactory.searchFlat(val).then(function (response) {
        if(response.status == 200) {
          vm.progress = false;
          var params = {
            query: val
          };
          return response.data.map(function (item) {
            return item;
          })
        }
        else if( response.status == 401){
          vm.progress = false;
          $state.go('auth.signout')
        }
      });
    }

    function onSelect($item, $model, $label) {
      vm.progress = false;
      vm.complaint.address.tower = $item.tower;
      vm.complaint.address.flat = $item.flat;
    };

    function changeStatus(){
      vm.progress = false;
      if(!vm.isConsumerRole && vm.complaint.status == 'New'){
        vm.complaint.status = 'In Progress ';
      }
    }

    function getEditInfo(){
      vm.progress = false;
      complaintFactory.findComplaint($stateParams.id).then(function (response) {
        if (response.status == 200) {
          vm.master = response.data;
          vm.complaint = angular.copy(vm.master)
          for(var i=0; i<vm.status.length; i++){
            if(vm.status[i] == vm.complaint.status){
              vm.complaint.status = vm.statusList[i];
            }
          }
          // if(vm.isAdminRole || vm.isManagementRole || vm.isConsumerRole){
          //   for(i=0; i<vm.status.length; i++){
          //     if(vm.status[i] == 'All'){
          //       vm.statusList.splice(i,1);
          //       vm.status.splice(i,1);
          //     }
          //   }
          // }
          if(vm.isConsumerRole && vm.complaint.status == 'New')
          {
            vm.statusList.splice(1,4);
            vm.status.splice(1,4);
          }
          else if(vm.isConsumerRole && vm.complaint.status == 'In Progress ')
          {
            vm.statusList.splice(3,2);
            vm.status.splice(3,2);
            for(var i=0; i<vm.status.length; i++)
            {
              if(vm.status[i]=='New') {
                vm.statusList.splice(i,1);
                vm.status.splice(i,1);
              }
            }
          }
          else if(vm.isConsumerRole && vm.complaint.status == 'Resolved')
          {
            vm.statusList.splice(0,1);
            vm.status.splice(0,1);
          }
          else if(vm.isConsumerRole && vm.complaint.status == 'Re Opened ')
          {
            vm.statusList.splice(0,1);
            vm.status.splice(0,1);
            for(var i=0; i<vm.status.length; i++)
            {
              if(vm.status[i]=='Closed') {
                vm.statusList.splice(i, 1);
                vm.status.splice(i, 1);
              }
            }
          }
          else if(vm.isConsumerRole && vm.complaint.status == 'Closed'){
            vm.statusList.splice(0,1);
            vm.status.splice(0,1);
            for(var i=0; i<vm.status.length; i++)
            {
              if(vm.status[i]=='Resolved') {
                vm.statusList.splice(i, 1);
                vm.status.splice(i, 1);
                console.log(vm.status)
              }
            }
          }
          populateAssignToList(vm.complaint.complaintType);
          // if(vm.flat != null){
          //   for(var index = 0 ; index < vm.flat.length ; index++){
          //     if(vm.complaint.registerFor.flatId == vm.flat[index].flatId){
          //       vm.complaint.registerFor = vm.flat[index];
          //     }
          //   };
          // }
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
        else if( response.status == 401){
          $state.go('auth.signout')
        }
        else {
          toaster.error('Some problem', 'error');
          console.error(response);
        }
      });
    }

    function populateAssignToList(complaintType){
      complaintFactory.userByComplaintType(complaintType).then(function (response) {
        if(response.status == 200) {
          vm.progress = false;
          vm.assignTo = response.data;
          if (vm.complaint.assignedTo != null) {
            for (var index = 0; index < vm.assignTo.length; index++) {
              if (vm.complaint.assignedTo.id == vm.assignTo[index].id) {
                vm.complaint.assignedTo = vm.assignTo[index];
                console.log(vm.complaint.assignedTo)
              }
            }
          }
          else {

          }
        }
        else if( response.status == 401){
          vm.progress = false;
          $state.go('auth.signout')
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
      vm.progress = true;
      var firstError = null;

      for(var index=0 ; index < vm.statusList.length ; index++){
        if(vm.statusList[index] == vm.complaint.status)
          vm.complaint.status = vm.status[index];
      }

      if (vm.Form.$invalid) {
        vm.progress = false;

        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        complaintFactory.editComplaint($stateParams.id, vm.complaint).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            vm.progress = false;
            toaster.info('Complaint updated');
            vm.message = "Complaint updated";
            $state.go('app.complaint',{msg:vm.message});
          }
          else if (response.status == -1) {
            vm.progress = false;
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.progress = false;
            vm.errorMessage = response.data.message;
            toaster.error(response.data.message, 'error');
            console.error(response);
          }
          else if( response.status == 401){
            vm.progress = false;
            $state.go('auth.signout')
          }
          else {
            vm.progress = false;
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

