
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintListCtrl', ComplaintListCtrl);

  ComplaintListCtrl.$inject = [ 'NgTableParams', '$state', '$localStorage', '$filter', 'complaintFactory', 'validationHelperFactory', '$stateParams' , 'toaster', 'role'];
  /* @ngInject */
  function ComplaintListCtrl( NgTableParams, $state, $localStorage, $filter, complaintFactory, validationHelperFactory, $stateParams , toaster, role) {
    var vm = this;
    vm.resolved = resolved;
    vm.active = active;
    vm.message = false;
    vm.progress = true;
    vm.flat = {};
    vm.breadcrumbRoute = breadcrumbRoute;

    vm.complaintMsg = $stateParams.msg;

    function breadcrumbRoute(){
      $state.go('app.notice')
    }

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
        if(response.status == 200){
          vm.society = response.data;
          console.log(vm.society)
          vm.flat.society = vm.society[0];
          console.log(vm.flat.society)
          active();
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });

    };

    function active() {
      vm.hideMsg = true;
      if(vm.flat.society == undefined){
        vm.progress = false;
        vm.message = "No data available";
      }
      else {
        complaintFactory.getComplaintByUser(vm.flat.society.id).then(function (response) {

          vm.progress = false;
          vm.master = response.data;
          console.log(vm.master)

          if (response.status == 200) {
            vm.master = response.data;
            console.log(response.data)
            for(var i=0; i<vm.master.length; i++){
              if(vm.master[i].status == 'In_Progress'){
                vm.master[i].status = 'In Progress';
              }
              if(vm.master[i].status == 'Re_Opened'){
                vm.master[i].status = 'Re Opened';
              }
            }
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

     function resolved() {
       vm.hideMsg = false;
       complaintFactory.getResolvedComplaintByUser().then(function (response) {

         vm.progress = false;

         if (response.status == 200) {
           vm.masterResolved = response.data;
           console.log(response.data)
           for(var i=0; i<vm.masterResolved.length; i++){
             if(vm.masterResolved[i].status == 'In_Progress'){
               vm.masterResolved[i].status = 'In Progress';
             }
             if(vm.masterResolved[i].status == 'Re_Opened'){
               vm.masterResolved[i].status = 'Re Opened';
             }
           }
           closedComplaint();
           resolvedComplaintData();
         }
         else if (response.status == -1) {
           toaster.error('Network Error', 'error');
           vm.errorMessage = "Network Error";
           console.error(response);
         }
         else if (response.status == 400) {
           console.error(response);
           vm.errorMessage = vm.masterResolved.message;
           toaster.error(vm.masterResolved.message);
         }
         else if (response.status == 401) {
           $state.go('auth.signout')
         }
         else {
           toaster.error('Some problem', 'error');
           console.error(response);
         }
       });
     };

      function closedComplaint(){
        vm.hideMsg = false;
      complaintFactory.getClosedComplaintByUser().then(function (response) {

         vm.progress = false;

         if (response.status == 200) {
           vm.masterClosed = response.data;
           console.log(response.data)
           resolvedComplaintData();
         }
         else if (response.status == -1) {
           toaster.error('Network Error', 'error');
           vm.errorMessage = "Network Error";
           console.error(response);
         }
         else if (response.status == 400) {
           console.error(response);
           vm.errorMessage = vm.masterClosed.message;
           toaster.error(vm.masterClosed.message);
         }
         else if( response.status == 401){
           $state.go('auth.signout')
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

    function resolvedComplaintData(){
      var complaintList = [];
      complaintList = vm.masterResolved.concat(vm.masterClosed)
      vm.resolvedTableParams = new NgTableParams(
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

            if(complaintList != null && complaintList[0] != undefined){
              vm.IsHidden=true;
            }
            else{
              vm.message="No data available";
            }

            if (complaintList  != null) {
              var filteredData = null;
              var orderedData = null;
              if (params != null) {
                if (params.filter()) {
                  filteredData = $filter('filter')(complaintList , params.filter())
                }
                else {
                  filteredData = complaintList ;
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
                return complaintList;
              }

            }
          }
        });
    }
  }
})();
