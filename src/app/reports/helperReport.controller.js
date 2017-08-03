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


    };

    vm.hideTable = function(){
      vm.IsHidden = false;
    }

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
        vm.errorMessage = false;
        vm.message = false;
        vm.IsHidden = false;
        vm.formData = new FormData();

        var firstError = null;

        if(vm.helper.helperType == 'Working helpers'){
          vm.isWorking = false;
          helperReportFactory.getWorkingHelperReport(vm.isWorking).then(function (response) {

            if(response.status == 200){
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
              reportList();
            }
            else if (response.status == -1) {
              toaster.error('Network Error');
              vm.errorMessage = "Network Error";
              console.error(response);
            }
            else if (response.status == 400) {
              console.error(response);
              vm.errorMessage = response.data[0].message;
              toaster.error(response.data[0].message);
            }
            else if( response.status == 401){
              $state.go('auth.signout')
            }
            else {
              toaster.error('Some problem');
              console.error(response);
            }
          })
        }

        else if(vm.helper.helperType == 'Non-working helpers'){
          vm.isWorking = true;
          helperReportFactory.getWorkingHelperReport(vm.isWorking).then(function (response) {

            if(response.status == 200){
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
              reportList();
            }
            else if (response.status == -1) {
              toaster.error('Network Error');
              vm.errorMessage = "Network Error";
              console.error(response);
            }
            else if (response.status == 400) {
              console.error(response);
              vm.errorMessage = response.data[0].message;
              toaster.error(response.data[0].message);
            }
            else if( response.status == 401){
              $state.go('auth.signout')
            }
            else {
              toaster.error('Some problem');
              console.error(response);
            }
          })
        }

        else if(vm.helper.helperType == 'Helper'){
          helperReportFactory.getHelperReport(vm.helper.number).then(function (response) {

            if(response.status == 200){
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
              reportList();
            }
            else if (response.status == -1) {
              toaster.error('Network Error');
              vm.errorMessage = "Network Error";
              console.error(response);
            }
            else if (response.status == 400) {
              vm.reportProgress = false;
              console.error(response);
              vm.errorMessage = response.data[0].message;
              toaster.error(response.data[0].message);
            }
            else if( response.status == 401){
              $state.go('auth.signout')
            }
            else {
              toaster.error('Some problem');
              console.error(response);
            }
          })
        }
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
            type: '' // initial filter
          }
        }, {
          // total: data.length,
          getData: function (params) {
            vm.reportProgress = false;
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
