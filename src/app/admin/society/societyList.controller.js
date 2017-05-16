
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('SocietyListCtrl', SocietyListCtrl);

  SocietyListCtrl.$inject = [ 'NgTableParams', '$localStorage', '$filter', 'societyFactory', 'validationHelperFactory', '$stateParams' , 'toaster', 'role'];
  /* @ngInject */
  function SocietyListCtrl( NgTableParams, $localStorage, $filter, societyFactory, validationHelperFactory, $stateParams , toaster, role) {
    var vm = this;

    vm.progress = true;
    activate();

    function activate() {

      societyFactory.societyList().then(function (response) {

        vm.progress = false;

        if (response.status == 200) {
          vm.master = response.data;
          console.log(response.data)
          societyData();
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
      })
    };

    function societyData() {
      vm.tableParams = new NgTableParams(
        {
          page: 1, // show first page
          count: 10, // count per page
          sorting: {
            date: '' // initial sorting
          }, // count per page
          filter: {
            date: '' // initial filter
          }
        }, {
          // total: data.length,

          getData: function (params) {
              self.progress = false;
            if (vm.master != null) {

              if (vm.master[0] = undefined) {
                vm.message = "No data available";
              }
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
