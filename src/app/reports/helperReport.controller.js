(function () {
  'use strict';

  angular
    .module('app.reports')
    .controller('HelperReportController', HelperReportController);

  HelperReportController.$inject = ['$q', '$http', 'validationHelperFactory', 'toaster', 'helperReportFactory', 'NgTableParams', '$filter', '$scope', '$localStorage' , '$state'];
  /* @ngInject */
  function HelperReportController($q, $http, validationHelperFactory,  toaster, helperReportFactory , NgTableParams, $filter, $scope ,$localStorage ,$state ) {

    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.progress = true;

    function breadcrumbRoute() {
      $state.go('app.notice')
    }

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {

      helperReportFactory.societyList().then(function (response) {
        if(response.status == 200){
          vm.society = response.data;
          console.log(vm.society)
          // vm.complaint.society = vm.society[0];
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });

      helperReportFactory.loadStatusDetails().then(function (response) {
        if(response.status == 200){
          vm.status = response.data;
        }
        else if(response.status == 401){
          $state.go('auth.signout');
        }
      });

      vm.endDateValidation = function () {
        vm.endMinDate = vm.start;
      }
    };

    //function to generate the report
    vm.generate = function () {
      if (vm.Form.$invalid) {
        vm.reportProgress = false;
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = "Validation Error";
        return;
      }
      else {
        vm.reportProgress = true;
        vm.download = false;
        vm.errorMessage = false;
        vm.message = false;
        vm.IsHidden = false;
        vm.formData = new FormData();

        var firstError = null;

        helperReportFactory.getReports(vm.complaint.status, vm.start , vm.end, vm.complaint.society.id).then(function (response) {

          if(response.status == 200){
            vm.master = response.data;
            console.log(response.data)
            // for ( var index =0 ; index < vm.master.length ; index ++){
            //
            //   var createdOn= vm.master[index].createdOn.split(" ");
            //   var temp1 = createdOn[1].split(":");
            //   var temp = createdOn[0].split("/");
            //   vm.master[index].createdOn = new Date(temp[2], temp[1]-1 , temp[0], temp1[0] , temp1[1]);
            //
            // }
            reportList();
          }
          else if (response.status == -1) {
            toaster.error('Network Error', 'error');
            vm.errorMessage = "Network Error";
            console.error(response);
          }
          else if (response.status == 400) {
            console.error(response);
            vm.errorMessage = response.data[0].message;
            toaster.error(response.data[0].message, 'error');
          }
          else if( response.status == 401){
            $state.go('auth.signout')
          }
          else {
            toaster.error('Some problem', 'error');
            console.error(response);
          }
        })
      }
    };
    function reportList(){
      vm.tableParams = new NgTableParams(
        {
          page: 1, // show first page
          count: 10, // count per page
          sorting: {
            lastModified: 'asc' // initial sorting
          }, // count per page
          filter: {
            createdOn: '' // initial filter
          }
        }, {
          // total: data.length,
          getData: function (params) {
            vm.reportProgress = false;
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
