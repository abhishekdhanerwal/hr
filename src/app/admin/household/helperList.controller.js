
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('HelperListCtrl', HelperListCtrl);

  HelperListCtrl.$inject = [ 'NgTableParams', '$state', '$localStorage', '$filter', 'helperFactory', 'validationHelperFactory', '$stateParams', 'toaster', 'role', 'SweetAlert'];
  /* @ngInject */
  function HelperListCtrl( NgTableParams, $state, $localStorage, $filter, helperFactory, validationHelperFactory, $stateParams , toaster, role, SweetAlert) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.message = false;
    vm.progress = true;

    vm.helperMsg = $stateParams.msg;

    function breadcrumbRoute() {
      if(vm.isMeterManagementRole) {
        $state.go('app.complaint')
      }
      else if(vm.isCreatorRole || vm.isSuperAdminRole){
        $state.go('app.society')
      }
      else if(vm.isVisitorAdminRole){
        $state.go('app.visitor')
      }
      else{
        $state.go('app.notice')
      }
    }

    vm.helperAlertBox = function(){
      vm.helperMsg = false;
    };

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
      $stateParams.msg = false;
    };
    activate();

    function activate() {

      vm.isAdminRole = role.isAdminRole();
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isConsumerRole = role.isConsumerRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isCreatorRole = role.isCreatorRole();
      vm.isMeterManagementRole = role.isMeterManagementRole();
      vm.isVisitorAdminRole = role.isVisitorAdminRole();

      vm.abc = new Date();

      if(vm.isConsumerRole){
        helperFactory.helperListForConsumer().then(function (response) {

          vm.progress = false;

          if (response.status == 200) {
            vm.master = response.data;
            for(var i=0; i<vm.master.length; i++){
              vm.helperNo = vm.master[i].helperNo;
              if(vm.master[i].type == 'Car_Cleaner'){
                vm.master[i].type = 'Car Cleaner';
              }
              if(vm.master[i].policeVerificationDone == false){
                vm.master[i].policeVerificationDone = 'No';
              }
              if(vm.master[i].policeVerificationDone == true){
                vm.master[i].policeVerificationDone = 'Yes';
              }
            }
            for (var flag=0 ; flag<vm.master.length ; flag++){
              for(var index=0 ; index<vm.master[flag].workingAt.length ; index++){
                if($localStorage._identity != undefined){
                  if(vm.master[flag].workingAt[index].user.id == $localStorage._identity.principal.id){
                    vm.master[flag].startDate = angular.copy(vm.master[flag].workingAt[index].helperMap[vm.master[flag].helperNo][0]);
                    vm.master[flag].endDate = angular.copy(vm.master[flag].workingAt[index].helperMap[vm.master[flag].helperNo][1]);
                  }
                }
              }
            }
            console.log(vm.master)
            helperData();
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
          else if (response.status == 401) {
            $state.go('auth.signout')
          }
          else {
            toaster.error('Some problem', 'error');
            console.error(response);
          }
        })
      }
      else{
        helperFactory.helperList().then(function (response) {

          vm.progress = false;

          if (response.status == 200) {
            vm.master = response.data;
            for(var i=0; i<vm.master.length; i++){
              if(vm.master[i].type == 'Car_Cleaner'){
                vm.master[i].type = 'Car Cleaner';
              }
              if(vm.master[i].policeVerificationDone == false){
                vm.master[i].policeVerificationDone = 'No';
              }
              if(vm.master[i].policeVerificationDone == true){
                vm.master[i].policeVerificationDone = 'Yes';
              }
            }
            console.log(vm.master)
            helperData();
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
          else if (response.status == 401) {
            $state.go('auth.signout')
          }
          else {
            toaster.error('Some problem', 'error');
            console.error(response);
          }
        })
      }
    };

    function helperData() {
      vm.tableParams = new NgTableParams(
        {
          page: 1, // show first page
          count: 100, // count per page
          sorting: {
            type: 'asc',
            helperNo: 'asc'// initial sorting
          }, // count per page
          filter: {
            type: '',
            helperNo: ''// initial filter
          }
        }, {
          // total: data.length,

          getData: function (params) {
            self.progress = false;
            if(vm.master != null && vm.master[0] != undefined){
              vm.IsHidden=true;
              vm.download = true;
            }
            else{
              vm.helperMsg = "";
              vm.message="No data available";
            }
            if (vm.master != null) {

              var filteredData = null;
              var orderedData = null;
              if (params != null) {
                if (params.filter()) {
                  filteredData = $filter('filter')(vm.master, params.filter())
                }
                else {
                  filteredData = vm.master;
                }
                if (params.sorting()) {
                  orderedData = $filter('orderBy')(filteredData, params.orderBy());
                }
                else {
                  orderedData = filteredData;
                }
                params.total(orderedData.length);
                var returnData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())
                return returnData;
              }
              else {
                return vm.master;
              }

            }
          }
        });

      // vm.remove = function (id) {
      //   vm.progress = true;
      //   helperFactory.removeHelper(vm.helperNo).then(function (response) {
      //
      //     if (response.status == 200) {
      //       toaster.info('Helper Removed Successfully');
      //       vm.progress = false;
      //       activate();
      //     }
      //     else if (response.status == -1) {
      //       vm.errorMessage = 'Network Error';
      //       toaster.error('Network Error');
      //       console.error(response);
      //       vm.progress = false;
      //     }
      //     else if (response.status == 400) {
      //       vm.errorMessage = response.data[0].message;
      //       toaster.error(response.data[0].message);
      //       console.error(vm.errorMessage);
      //       vm.progress = false;
      //     }
      //     else if (response.status == 401) {
      //       $state.go('auth.signout')
      //       vm.progress = false;
      //     }
      //     else {
      //       vm.errorMessage = 'Some problem';
      //       toaster.error('Some problem');
      //       vm.progress = false;
      //       console.error(response);
      //     }
      //     $state.reload();
      //   });
      // };
        vm.remove = function (helperNo) {
          vm.progress = false;
          SweetAlert.swal({
            title: "Are you sure?",
            text: "You want to remove the helper!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#4CAF50",
            confirmButtonText: "Yes",
            cancelButton: "#008CBA",
            cancelButtonText: "No",
            closeOnConfirm: true,
            closeOnCancel: true
          }, function (isConfirm) {
            if (isConfirm) {
              vm.progress = true;
              helperFactory.removeHelper(helperNo).then(function (response) {
                if (response.status == 200) {
                  vm.progress = false;
                  $state.reload();
                  toaster.info('Helper Removed Successfully');
                }
                else if (response.status == -1) {
                  vm.progress = false;
                  toaster.error('Network Error');
                }
                else if( response.status == 401){
                  $state.go('auth.signout')
                }
                else {
                  vm.progress = false;
                  toaster.error(response.data[0].message);
                  vm.errorMessage = response.data[0].message;
                }

              });
            } else {
            }
          });

        };
        // var index = -1;
        // var comArr = eval(vm.helperRow);
        // for (var i = 0; i < comArr.length; i++) {
        //   if (comArr[i].name === name) {
        //     index = i;
        //     break;
        //   }
        // }
        // if (index === -1) {
        //   alert("Something gone wrong");
        // }
        // vm.helperRow.splice(index, 1);
    };
  }
})();
