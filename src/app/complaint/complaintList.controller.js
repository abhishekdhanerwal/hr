
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintListCtrl', ComplaintListCtrl);

  ComplaintListCtrl.$inject = [ 'NgTableParams', '$localStorage', '$filter', 'complaintFactory', 'validationHelperFactory', '$stateParams' , 'toaster', 'role'];
  /* @ngInject */
  function ComplaintListCtrl( NgTableParams, $localStorage, $filter, complaintFactory, validationHelperFactory, $stateParams , toaster, role) {
    var vm = this;
    vm.resolved = resolved;
    vm.active = active;
    vm.message = false;
    vm.progress = true;
    vm.flat = {};
    vm.char = 4;

    vm.complaintMsg = $stateParams.msg;

    vm.hideComplaintBox = function () {
      vm.complaintMsg = false;
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

      complaintFactory.societyList().then(function (response) {
        vm.society = response.data;
        console.log(vm.society)
        vm.flat.society = vm.society[0];
        console.log(vm.flat.society)
        active();
      });

    };

    function active() {
      if(vm.flat.society == undefined){
        vm.progress = false;
        vm.message = "No data available";
      }
      else {
        complaintFactory.getComplaintByUser(vm.flat.society.id).then(function (response) {
          console.log(vm.flat.society.id)

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
      }
    };

     function resolved() {
      complaintFactory.getResolvedComplaintByUser().then(function (response) {

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
            lastModified: 'desc'   // initial sorting
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
