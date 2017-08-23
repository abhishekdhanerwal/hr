
(function () {
  'use strict';

  angular
    .module('app.visitors')
    .controller('VisitorListCtrl', VisitorListCtrl);

  VisitorListCtrl.$inject = [ 'NgTableParams', '$state', '$localStorage', '$filter', 'visitorFactory', 'validationHelperFactory', '$stateParams', 'toaster', 'role'];
  /* @ngInject */
  function VisitorListCtrl( NgTableParams, $state, $localStorage, $filter, visitorFactory, validationHelperFactory, $stateParams , toaster, role) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.message = false;
    vm.progress = true;
    vm.disableFlat = true;

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
      vm.societyMsg = false;
    };

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
      $stateParams.msg = false;
    };

    activate();

    function activate() {

      vm.isAdminRole = role.isAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isConsumerRole = role.isConsumerRole();
      vm.isCreatorRole = role.isCreatorRole();
      vm.isVisitorAdminRole = role.isVisitorAdminRole();

        visitorFactory.visitorList().then(function (response) {

          vm.progress = false;

          if (response.status == 200) {
            vm.master = response.data;
            for (var i = 0; i < vm.master.length; i++) {
              if (vm.master[i].type == 'Non_Permanent') {
                vm.master[i].type = 'Non Permanent';
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

    };

    function helperData() {
      vm.tableParams = new NgTableParams(
        {
          page: 1, // show first page
          count: 100, // count per page
          sorting: {
            type: 'asc' // initial sorting
          }, // count per page
          filter: {
            type: '' // initial filter
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
