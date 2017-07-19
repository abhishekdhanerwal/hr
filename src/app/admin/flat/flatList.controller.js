
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('FlatListCtrl', FlatListCtrl);

  FlatListCtrl.$inject = [ 'NgTableParams', '$state', '$localStorage', '$filter', 'flatFactory', 'validationHelperFactory', '$stateParams' , 'toaster', '$rootScope', 'role'];
  /* @ngInject */
  function FlatListCtrl( NgTableParams, $state, $localStorage, $filter, flatFactory, validationHelperFactory, $stateParams , toaster, $rootScope, role) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.message = false;
    vm.progress = true;
    vm.flatMsg = $stateParams.msg;

    function breadcrumbRoute() {
      if(!vm.isCreatorRole) {
        $state.go('app.notice')
      }
      else{
        $state.go('app.society')
      }
    }

    vm.flatAlertBox = function(){
      vm.flatMsg = false;
    }

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
      $stateParams.msg = false;
    };

    activate();

    function activate() {

      vm.isCreatorRole = role.isCreatorRole();

      if($localStorage._identity !=null) {
        $localStorage._identity.societyId = null;
      }

        flatFactory.flatList().then(function (response) {

          vm.SocietyFlatData = false;

          if (response.status == 200) {
            vm.progress = false;
            vm.master = response.data;
            console.log(vm.master)
            for(var i=0; i<vm.master.length; i++){
              if(vm.master[i].hasOwner == true) {
                vm.master[i].hasOwner = 'Yes';
              }
              if(vm.master[i].hasResident == true){
                vm.master[i].hasResident = 'Yes';
              }
              if(vm.master[i].hasOwner == false){
                vm.master[i].hasOwner = 'No';
              }
              if(vm.master[i].hasResident == false){
                vm.master[i].hasResident = 'No';
              }
            }
            console.log(response.data)
            FlatData();
          }
          else if (response.status == -1) {
            vm.progress = false;
            toaster.error('Network Error', 'error');
            vm.errorMessage = "Network Error";
            console.error(response);
          }
          else if (response.status == 400) {
            vm.progress = false;
            console.error(response);
            vm.errorMessage = vm.master[0].message;
            toaster.error(vm.master[0].message);
          }
          else if( response.status == 401){
            $state.go('auth.signout')
          }
          else {
            toaster.error('Some problem', 'error');
            console.error(response);
          }
        })

      // else {
      //   flatFactory.flatListBySociety($stateParams.id).then(function (response) {
      //
      //     vm.progress = false;
      //
      //     if (response.status == 200) {
      //       vm.master = response.data;
      //       console.log(vm.master)
      //       for (var i = 0; i < vm.master.length; i++) {
      //         if (vm.master[i].hasOwner == true) {
      //           vm.master[i].hasOwner = 'Yes';
      //         }
      //         if (vm.master[i].hasResident == true) {
      //           vm.master[i].hasResident = 'Yes';
      //         }
      //         if (vm.master[i].hasOwner == false) {
      //           vm.master[i].hasOwner = 'No';
      //         }
      //         if (vm.master[i].hasResident == false) {
      //           vm.master[i].hasResident = 'No';
      //         }
      //       }
      //       console.log(response.data)
      //       FlatData();
      //     }
      //     else if (response.status == -1) {
      //       toaster.error('Network Error', 'error');
      //       vm.errorMessage = "Network Error";
      //       console.error(response);
      //     }
      //     else if (response.status == 400) {
      //       console.error(response);
      //       vm.errorMessage = vm.master[0].message;
      //       toaster.error(vm.master[0].message);
      //     }
      //     else {
      //       toaster.error('Some problem', 'error');
      //       console.error(response);
      //     }
      //   })
      // }
    };

    function FlatData() {
      vm.tableParams = new NgTableParams(
        {
          page: 1, // show first page
          count: 10, // count per page
          sorting: {
            lastModified: 'asc' // initial sorting
          }, // count per page
          filter: {
            tower: '' // initial filter
          }
        }, {
          // total: data.length,

          getData: function (params) {
            vm.progress = false;

            if(vm.master != null && vm.master[0] != undefined){
              vm.IsHidden=true;
            }
            else{
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
    };

  }
})();
