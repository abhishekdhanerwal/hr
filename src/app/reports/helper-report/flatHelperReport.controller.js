(function () {
  'use strict';

  angular
    .module('app.reports')
    .controller('FlatHelperReportController', FlatHelperReportController);

  FlatHelperReportController.$inject = ['$q', '$http', 'validationHelperFactory', 'toaster', 'helperReportFactory', 'NgTableParams', '$filter', '$scope', '$localStorage' , '$state', 'role'];
  /* @ngInject */
  function FlatHelperReportController($q, $http, validationHelperFactory,  toaster, helperReportFactory , NgTableParams, $filter, $scope ,$localStorage ,$state, role ) {

    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.progress = true;
    vm.searchFlat = searchFlat;
    vm.onSelect = onSelect;
    vm.clearFlat = clearFlat;
    vm.disableFlat = true;
    vm.showError = false;

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

      vm.helper = [];
      vm.helper.society = {};

      vm.helper.society.id = $localStorage._identity.principal.societyId;

      helperReportFactory.getTowerList($localStorage._identity.principal.societyId).then(function (response) {
        vm.towerList = response.data;
      });

    };

    vm.hideTable = function () {
      vm.IsHidden = false;
    }

    vm.disableFlatInput = function () {
      vm.showError = false;
      vm.IsHidden = false;
      vm.flatsearch = "";
      helperReportFactory.findAllFlats(vm.tower).then(function (response) {
        if (response.status == 200) {
          vm.allFlatList = response.data;
          console.log(vm.allFlatList);
          vm.disableFlat = false;
        }
        else if (response.status == 401) {
          $state.go('auth.signout')
        }
      });
    }

    function searchFlat(val) {
      vm.flatList = [];
      for(var index=0 ; index<vm.allFlatList.length;index++){
        if(val == vm.allFlatList[index].flatNo.slice(0,val.length)){
          vm.flatList.push(vm.allFlatList[index]);
        }
      }
      return vm.flatList;
    }

    function onSelect($item, $model, $label) {
      vm.helper.tower = $item.tower;
      vm.helper.flat = $item.flat;
    };

    function clearFlat() {
      vm.flatsearch = '';
    }

    vm.hideTable = function(){
      vm.IsHidden = false;
      vm.message = "";
    }

    //function to generate the report
    vm.generate = function () {
      vm.showError = true;
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

          if(vm.flatList!=undefined){
            if(vm.flatList.length == 0){
              vm.flatNoByTower = null;
            }
            else{
              for (var i = 0; i < vm.flatList.length; i++) {
                if (vm.flatList[i].flatNo == vm.flatsearch || vm.flatList[i].flatNo == vm.flatsearch.flatNo) {
                  vm.flatNoByTower = vm.flatList[i];
                  break;
                }
                else {
                  vm.flatNoByTower = null;
                }
              }
            }
          }
          if (vm.flatNoByTower == undefined || vm.flatsearch.toString().length == 1) {
            vm.reportProgress = false;
            toaster.error('Flat not found');
            vm.errorMessage = 'Flat not found';
          }
          else {

          helperReportFactory.getFlatHelperReports(vm.tower, vm.flatNoByTower.flatNo).then(function (response) {

            if (response.status == 200) {
              vm.master = response.data;
              for (var i=0 ; i<vm.master.length ; i++){
                for(var j=0 ; j<vm.master[i].workingAt.length ; j++){
                  vm.master[i].workingAt[j].startDate = angular.copy(vm.master[i].workingAt[j].helperMap[vm.master[i].helperNo][0]);
                  vm.master[i].workingAt[j].endDate = angular.copy(vm.master[i].workingAt[j].helperMap[vm.master[i].helperNo][1]);
                  vm.master[i].workingAt[j].startDate = new Date(vm.master[i].workingAt[j].startDate);
                  vm.master[i].workingAt[j].endDate = new Date(vm.master[i].workingAt[j].endDate);
                }
              }
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
              toaster.error('Network Error', 'error');
              vm.errorMessage = "Network Error";
              console.error(response);
            }
            else if (response.status == 400) {
              console.error(response);
              vm.errorMessage = response.data.message;
              toaster.error(response.data.message, 'error');
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
          count: 100, // count per page
          sorting: {
            lastModified: 'asc' // initial sorting
          }, // count per page
          filter: {
            type: '',
            helperNo: ''// initial filter
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
