(function () {
  'use strict';

  angular
    .module('app.reports')
    .controller('ComplaintReportController', ComplaintReportController);

  ComplaintReportController.$inject = ['$q', '$http', 'validationHelperFactory', 'toaster', 'complaintReportFactory', 'NgTableParams', '$filter', '$scope', '$localStorage' , '$state'];
  /* @ngInject */
  function ComplaintReportController($q, $http, validationHelperFactory,  toaster,complaintReportFactory , NgTableParams, $filter, $scope ,$localStorage ,$state ) {

    var vm = this;
    vm.progress = true;

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {

      complaintReportFactory.loadStatusDetails().then(function (response) {
        vm.status = response.data;
      });

      //function for end date
      vm.endOpen = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.startOpened = false;
        vm.endOpened = !vm.endOpened;
      };
      //function for start date
      vm.startOpen = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.endOpened = false;
        vm.startOpened = !vm.startOpened;
      };

      vm.startDateOption = {
        showWeeks: false,
        maxDate: vm.end,
        minDate: new Date(1970, 12, 31),
        startingDay: 1
      };
      vm.endDateOption = {
        showWeeks: false,
        maxDate: new Date(2020, 5, 22),
        minDate: vm.start,
        startingDay: 1
      };

    };

    vm.csv = function(){
      var randomTime = $filter('date')(new Date(), 'dd/MM hh:mm a');
      $http({method: 'GET', url: __env.notificationServerUrl + '/csv/alarmConditions?siteId='+ vm.siteId +'&fromDate=' + vm.start.toISOString() + '&toDate=' + vm.end.toISOString()}).
      success(function(data, status, headers, config) {
        var anchor = angular.element('<a/>');
        anchor.css({display: 'none'}); // Make sure it's not visible
        angular.element(document.body).append(anchor); // Attach to document
        anchor.attr({
          href: 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(data),
          target: '_blank',
          download: 'AlertsReport-'+randomTime+'.csv'
        })[0].click();

        anchor.remove(); // Clean it up afterwards
      })
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

        complaintReportFactory.getReports(vm.complaint.status, vm.start , vm.end).then(function (response) {
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
            createdOn: '' // initial sorting
          }, // count per page
          filter: {
            createdOn: '',
            status: '' // initial filter
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
