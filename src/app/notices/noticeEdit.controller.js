
(function () {
  'use strict';

  angular
    .module('app.notice')
    .controller('NoticeEditCtrl', NoticeEditCtrl);

  NoticeEditCtrl.$inject = ['$state', 'validationHelperFactory', 'role', 'toaster' , '$uibModal' , 'noticeFactory' , '$stateParams' , 'NgTableParams' , '$filter' , 'FileUploader', '$scope'];
  /* @ngInject */
  function NoticeEditCtrl($state, validationHelperFactory , role, toaster , $uibModal , noticeFactory ,$stateParams , NgTableParams, $filter , FileUploader , $scope) {
    var vm = this;
    vm.notice = {};
    vm.progress = true;
    vm.submit = submit;
    vm.reset = reset;
    vm.noticeType = ['Festival', 'Voilation', 'General'];
    vm.disableActivationTime = false;

    activate();

    function activate() {
      vm.isAdminRole = role.isAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isConsumerRole = role.isConsumerRole();

      noticeFactory.getSocietyUser().then(function (response) {
        console.log(response.data);

        if (response.status == 200) {
          vm.societyUserList = response.data;
          getNoticeData();
        }
        else if (response.status == -1) {
          vm.errorMessage = 'Network Error';
          toaster.error('Network Error', 'error');
          console.error(response);
        }
        else if (response.status == 400) {
          vm.errorMessage = response.data[0].message;
          toaster.error(response.data[0].message, 'error');
          console.error(response);
        }
        else {
          vm.errorMessage = 'Some problem';
          toaster.error('Some problem', 'error');
          console.error(response);
        }

      });

      function tableData() {
        vm.tableParams = new NgTableParams(
          {
            count: vm.societyUserList.length,
            // page: , // show first page
            // count: , // count per page
            // sorting: {
            //   lastModified: 'desc' // initial sorting
            // }, // count per page
            filter: {
              name: '' // initial filter
            }
          }, {
            counts: [],
            getData: function (params) {
              console.log(vm.societyUserList)

              if (vm.societyUserList != null) {
                var filteredData = null;
                var orderedData = null;
                if (params != null) {
                  if (params.filter()) {
                    filteredData = $filter('filter')(vm.societyUserList, params.filter())
                  }
                  else {
                    filteredData = vm.societyUserList;
                  }
                  if (params.sorting()) {
                    orderedData = $filter('orderBy')(filteredData, params.orderBy());
                  }
                  else {
                    orderedData = filteredData;
                  }

                  params.total(orderedData.length);
                  console.log(orderedData.length);
                  var returnData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())
                  return returnData;
                }
                else {
                  return vm.societyUserList;
                }
              }
            }
          })
        vm.hideUserList = true;

      }

      function getNoticeData() {
        noticeFactory.editNotice($stateParams.id).then(function (response) {
          console.log(response);

          if (response.status == 200) {
            vm.notice = response.data;

            vm.notice.activationTime = $filter('date')(vm.notice.activationTime, 'EEE MMM dd yyyy  hh:mm a');

            var count = 0;
            for (var temp = 0 ;temp < vm.societyUserList.length ; temp ++){
              for (var index = 0 ;index < vm.notice.audience.length ; index++){
                if(vm.societyUserList[temp].id == vm.notice.audience[index].id){
                  count ++;
                  vm.societyUserList[temp].checked = true;
                  break;
                }
                else{
                  vm.societyUserList[temp].checked = false;
                }
              }
            }
            console.log(count)
            if(count == vm.notice.audience.length){
              vm.audience = 'All';
              tableData();
            }
            else {
              vm.audience = 'Choose';
              tableData();
            }

            var currentTime = Date.now();
            if(currentTime > vm.notice.activationTime)
              vm.disableActivationTime = true;

            console.log(vm.disableActivationTime)

            var repeatInLoopSMS = true;
            var repeatInLoopEmail = true;
            var repeatInLoopMobile = true;
            for(var index = 0 ;index < vm.notice.communicationType.length ; index++){
              if(repeatInLoopSMS){
                if(vm.notice.communicationType[index] == 'SMS'){
                  vm.sms = true;
                  repeatInLoopSMS = false;
                }
                else{
                  vm.sms = false;
                }
              }
              if(repeatInLoopEmail){
                if(vm.notice.communicationType[index] == 'EMAIL'){
                  repeatInLoopEmail = false;
                  vm.email = true;
                }
                else{
                  vm.email = false;
                }
              }
              if(repeatInLoopMobile){
                if(vm.notice.communicationType[index] == 'MOBILE_NOTIFICATION'){
                  vm.mobileNotification = true;
                  repeatInLoopMobile = false;
                }
                else{
                  vm.mobileNotification = false;
                }
              }
            }
            vm.progress = false;
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data[0].message;
            toaster.error(response.data[0].message, 'error');
            console.error(response);
          }
          else {
            vm.errorMessage = 'Some problem';
            toaster.error('Some problem', 'error');
            console.error(response);
          }
        })
      }

    };

    vm.endDateValidation = function () {
      vm.endMinDate = vm.notice.startDate;
    }

    vm.openModal = function () {
      console.log('row')
      var modalInstance = $uibModal.open({
        templateUrl: 'activationTime.html',
        controller: 'editActivationTimeCtrl',
        resolve: {
          items: function () {
            return vm.notice.activationTime;
          },
          startDate: function () {
            return vm.notice.startDate;
          },
          endDate: function () {
            return vm.notice.endDate;
          }
        }
      });

      modalInstance.result.then(function (activationTime) {
        console.log(activationTime)
        var date = activationTime[0].split("-");
        var time = activationTime[1].split(":");
        if(time[2] == 'PM'){
          time[0] = parseInt(time[0]) + 12;
        }
        if(time[2] == 'AM' &&  parseInt(time[0])>11)
          time[0] = parseInt(time[0]) - 12;
        console.log(date);
        console.log(time)

        vm.notice.activationTime =new Date(date[0],date[1]-1,date[2], time[0], time[1]);
        console.log(vm.notice.activationTime)
      });

    };


    function submit() {
      console.log(vm.Form)

      if (vm.Form.$invalid) {
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;
      }
      else {

        vm.notice.communicationType = [];
        vm.notice.audience = [];
        if(vm.audience == 'All'){
          vm.notice.audience = angular.copy(vm.tempAudienceAll);
        }
        else if(vm.audience == 'Choose'){

        }
        if(vm.sms == true)
          vm.notice.communicationType.push('SMS');

        if(vm.email == true)
          vm.notice.communicationType.push('EMAIL');

        if(vm.mobileNotification == true)
          vm.notice.communicationType.push('MOBILE_NOTIFICATION');

        console.log(vm.notice)

        noticeFactory.newNotice(vm.notice).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            toaster.info('Notice Created');
            vm.message = "Notice Created";
            $state.go('app.notice');
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data[0].message;
            toaster.error(response.data[0].message, 'error');
            console.error(response);
          }
          else {
            vm.errorMessage = 'Some problem';
            toaster.error('Some problem', 'error');
            console.error(response);
          }
          vm.resetDisabled = false;
          vm.submitDisabled = false;
        });
      }
    };

    function reset() {
      activate();
    }

      var uploader = $scope.uploader = new FileUploader({
        url: 'http://localhost:8080/fileUpload/noticeUpload'
      });

      // FILTERS

      uploader.filters.push({
        // item: 'vm.notice.attachmentUrl',
        name: 'customFilter',
        fn: function (item/*{File|FileLikeObject}*/, options) {
          return this.queue.length < 10;
        }
      });

      // CALLBACKS

      uploader.onWhenAddingFileFailed = function (item/*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
      };
      uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
      };
      uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
      };
      uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
      };
      uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
      };
      uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
      };
      uploader.onSuccessItem = function (fileItem, response, status, headers) {
        vm.notice.attachmentUrl.push(response);
        console.info('onSuccessItem', fileItem, response, status, headers);
      };
      uploader.onErrorItem = function (fileItem, response, status, headers) {
        toaster.error('Image Not Saved');
        console.info('onErrorItem', fileItem, response, status, headers);
      };
      uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
      };
      uploader.onCompleteItem = function (fileItem, response, status, headers) {
        toaster.info('Image Saved');
        console.info('onCompleteItem', fileItem, response, status, headers);
      };
      uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
      };

      console.info('uploader', uploader);

  }
})();


(function () {
  'use strict';

  angular
    .module('app.notice')
    .controller('editActivationTimeCtrl', editActivationTimeCtrl);

  editActivationTimeCtrl.$inject = ["$scope", "$uibModalInstance" , "items" ,"startDate", "endDate", "$log" , "$filter"];
  /* @ngInject */
  function editActivationTimeCtrl($scope, $uibModalInstance, items ,startDate ,endDate , $log , $filter) {

    $scope.minDate = startDate;
    $scope.maxDate = endDate;

    if(items != undefined){

      $scope.date = new Date(items);
      $scope.time = new Date(items);

    }
    else{
      $scope.today = function () {
        $scope.date = new Date();
      };
      $scope.today();

      $scope.time = new Date(1970,0,1, 0, 0);
    }
    $scope.hstep = 1;
    $scope.mstep = 15;

    // Time Picker
    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function () {
      $scope.ismeridian = !$scope.ismeridian;
    };

    $scope.update = function () {
      var d = new Date();
      d.setHours(14);
      d.setMinutes(0);
      $scope.time = d;
    };

    $scope.schedule = [];


    $scope.ok = function () {
      $uibModalInstance.close($scope.schedule);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
