(function () {
  'use strict';

  angular
    .module('app.reports')
    .controller('FlatVisitorReportController', FlatVisitorReportController);

  FlatVisitorReportController.$inject = ['$q', '$http', 'role', 'validationHelperFactory', 'toaster', 'visitorReportFactory', 'NgTableParams', '$filter', '$scope', '$localStorage' , '$state'];
  /* @ngInject */
  function FlatVisitorReportController($q, $http, role, validationHelperFactory,  toaster, visitorReportFactory , NgTableParams, $filter, $scope ,$localStorage ,$state ) {

    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.searchFlat = searchFlat;
    vm.onSelect = onSelect;
    vm.clearFlat = clearFlat;
    vm.disableFlat = true;

    function breadcrumbRoute() {
      if(vm.isSuperAdminRole || vm.isMeterManagementRole) {
        $state.go('app.complaint')
      }
      else if(vm.isCreatorRole){
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
        vm.end = moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        $event.preventDefault();
        $event.stopPropagation();
        vm.startopened = false;
      };
      //function for start date
      vm.startOpen = function ($event) {
        vm.start = moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        $event.preventDefault();
        $event.stopPropagation();
        vm.endopened = false;
      };

      vm.endDateValidation = function () {
        vm.endMinDate = vm.start;
      }

      vm.hideTable = function () {
        vm.IsHidden = false;
        vm.message = "";
      }

      vm.visitor = [];
      vm.visitor.society = {};

      vm.visitor.society.id = $localStorage._identity.principal.societyId;

      visitorReportFactory.getTowerList($localStorage._identity.principal.societyId).then(function (response) {
        vm.towerList = response.data;
      });
    };

    vm.hideTable = function () {
      vm.IsHidden = false;
    }

    vm.disableFlatInput = function () {
      vm.IsHidden = false;
      vm.flatsearch = "";
      visitorReportFactory.findAllFlats(vm.tower).then(function (response) {
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
        if (vm.flatNoByTower == undefined) {
          vm.reportProgress = false;
          toaster.error('Flat not found');
          vm.errorMessage = 'Flat not found';
        }
        else {

          visitorReportFactory.getReports(vm.start, vm.end, vm.tower, vm.flatNoByTower.flatNo).then(function (response) {
            console.log(vm.start)

            if (response.status == 200) {
              vm.master = response.data;
              console.log(vm.master)
              for (var index = 0; index < vm.master.length; index++) {
                if (vm.master[index].type == 'Non_Permanent') {
                  vm.master[index].type = 'Non Permanent';
                }
              }
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
          count: 100, // count per page
          sorting: {
            arrivedAt: ''// initial sorting
          }, // count per page
          filter: {
            name: '',
            arrivedAt: ''
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
