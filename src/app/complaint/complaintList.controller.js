
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintListCtrl', ComplaintListCtrl);

  ComplaintListCtrl.$inject = [ 'NgTableParams', '$filter', 'complaintFactory', 'validationHelperFactory', '$stateParams'];
  /* @ngInject */
  function ComplaintListCtrl( NgTableParams, $filter, complaintFactory, validationHelperFactory, $stateParams) {
    var vm = this;

    activate();

    function activate() {
      complaintFactory.getComplaintDetails().then(function (response) {
        console.log($stateParams.id)
        if (response.status == 200) {
          vm.master = response.data;
          console.log(vm.master)
          complaintData();
        }
        else if (response.status == -1) {
          // logger.error('Network Error', 'error');
          vm.errorMessage = "Network Error";
          console.error(response);
        }
        else if (response.status == 400) {
          console.error(response);
          vm.errorMessage = vm.master[0].message;
          // logger.error(vm.master[0].message, 'error');
        }
        else {
          // logger.error('Some problem', 'error');
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
            date: '' // initial sorting
          }, // count per page
          filter: {
            date: '' // initial filter
          }
        }, {
          // total: data.length,

          getData: function (params) {

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
