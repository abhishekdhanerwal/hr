
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintListCtrl', ComplaintListCtrl);

  ComplaintListCtrl.$inject = [ 'NgTableParams', '$localStorage', '$filter', 'complaintFactory', 'validationHelperFactory', '$stateParams' , 'toaster', 'role'];
  /* @ngInject */
  function ComplaintListCtrl( NgTableParams, $localStorage, $filter, complaintFactory, validationHelperFactory, $stateParams , toaster, role) {
    var vm = this;
    vm.message = false;
    vm.progress = true;

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {

      vm.isAdminRole = role.isAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isConsumerRole = role.isConsumerRole();

      complaintFactory.getComplaintByUser().then(function (response) {

        vm.progress = false;
        vm.master = response.data;
        console.log(vm.master)

        if (response.status == 200) {
          vm.master = response.data;
          console.log(response.data)
          complaintData();
        }
        else if (response.status == -1) {
          toaster.error('Network Error', 'error');
          vm.errorMessage = "Network Error";
          console.error(response);
        }
        else if (response.status == 400) {
          console.error(response);
          vm.errorMessage = vm.master.message;
          toaster.error(vm.master.message);
        }
        else {
          toaster.error('Some problem', 'error');
          console.error(response);
        }
      })
    };

    function complaintData() {
      vm.tableParams = new NgTableParams(
        {
          page: 1, // show first page
          count: 10, // count per page
          sorting: {
            complaintType: '',
            status: ''   // initial sorting
          }, // count per page
          filter: {
            complaintType: '',
            status: ''// initial filter
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
