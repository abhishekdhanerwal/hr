(function () {
  'use strict';

  angular
    .module('app.reports')
    .controller('ComplaintReportController', ComplaintReportController);

  ComplaintReportController.$inject = ['$q', '$http', 'role', 'validationHelperFactory', 'toaster', 'complaintReportFactory', 'NgTableParams', '$filter', '$scope', '$localStorage' , '$state'];
  /* @ngInject */
  function ComplaintReportController($q, $http, role, validationHelperFactory,  toaster,complaintReportFactory , NgTableParams, $filter, $scope ,$localStorage ,$state ) {

    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.complaint ={};

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
      vm.isVisitorAdminRole = role.isVisitorAdminRole();

      //function for end date
      vm.endOpen = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.startopened = false;
      };
      //function for start date
      vm.startOpen = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.endopened = false;
      };

      complaintReportFactory.societyList().then(function (response) {
        if(response.status == 200){
          vm.society = response.data;
          if(vm.isAdminRole || vm.isManagementRole || vm.isMeterManagementRole){
            vm.complaint.society={};
            vm.complaint.society.id = $localStorage._identity.principal.societyId;
          }
          // vm.complaint.society = vm.society[0];
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });

      complaintReportFactory.loadStatusDetails().then(function (response) {
        if(response.status == 200){
          vm.status = response.data;
          vm.complaint.status = vm.status[0];
        }
        else if(response.status == 401){
          $state.go('auth.signout');
        }
      });

      vm.endDateValidation = function () {
        vm.endMinDate = vm.start;
      }

      vm.hideTable = function () {
        vm.IsHidden = false;
        vm.message = "";
      }
    };

    //function to generate the report
    vm.generate = function () {
      if (vm.Form.$invalid && vm.start!=undefined && vm.end!=undefined) {
        vm.reportProgress = false;
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = "Validation Error";
        return;
      }
      else {
        if (vm.start != undefined && vm.end == undefined) {
          vm.errorMessage = 'Please select end date also';
        }
          else if (vm.end !=undefined && vm.start == undefined){
            vm.errorMessage = 'Please select start date also';
          }
        else {
          vm.reportProgress = true;
          vm.download = false;
          vm.errorMessage = false;
          vm.message = false;
          vm.IsHidden = false;
          vm.formData = new FormData();

          var firstError = null;

          complaintReportFactory.getReports(vm.complaint.status, vm.start, vm.end, vm.complaint.society.id).then(function (response) {

            if (response.status == 200) {
              vm.master = response.data;
              console.log(vm.master)
              for (var i = 0; i < vm.master.length; i++) {
                if (vm.master[i].assignedTo != null) {
                  vm.master[i].assignee = "";
                  vm.master[i].assignee = vm.master[i].assignedTo.name;
                }
                else {
                  vm.master[i].assignee = "";
                }
              }
              console.log(vm.master)
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
            else if (response.status == 401) {
              $state.go('auth.signout')
            }
            else {
              toaster.error('Some problem', 'error');
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
            createdOn: 'desc' // initial sorting
          }, // count per page
          filter: {
            complaintType: '',
            assignee: ''
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
