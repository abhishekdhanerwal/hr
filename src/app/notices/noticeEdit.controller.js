
(function () {
  'use strict';

  angular
    .module('app.notice')
    .controller('NoticeEditCtrl', NoticeEditCtrl);

  NoticeEditCtrl.$inject = ['$state', 'validationHelperFactory', 'role', 'toaster' , '$uibModal' , 'noticeFactory' , '$stateParams' , 'NgTableParams' , '$filter' , 'FileUploader', '$scope'];
  /* @ngInject */
  function NoticeEditCtrl($state, validationHelperFactory , role, toaster , $uibModal , noticeFactory ,$stateParams , NgTableParams, $filter , FileUploader , $scope) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.notice = {};
    vm.progress = true;
    vm.submit = submit;
    vm.reset = reset;
    vm.noticeType = ['Festival', 'Voilation', 'General'];
    vm.disableActivationTime = false;
    vm.editNotice = true;
    vm.breadcrumbRoute = breadcrumbRoute;

    function breadcrumbRoute() {
      vm.isCreatorRole = role.isCreatorRole();

      if(vm.isCreatorRole){
        $state.go('app.society');
      }
      else if(!vm.isCreatorRole) {
        $state.go('app.notice');
      }
    }

    function breadcrumbRoute() {
      $state.go('app.notice')
    }

    activate();

    function activate() {
      vm.isAdminRole = role.isAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isConsumerRole = role.isConsumerRole();

      noticeFactory.getSocietyUser().then(function (response) {

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
        else if( response.status == 401){
          $state.go('auth.signout')
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
            if(count == vm.societyUserList.length){
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
          else if( response.status == 401){
            $state.go('auth.signout')
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
      });

    };


    function submit() {

      if (vm.Form.$invalid) {
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;
      }
      else {

        vm.notice.communicationType = [];
        vm.notice.audience = [];
        if(vm.audience == 'All'){
          vm.notice.audience = angular.copy(vm.societyUserList);
        }
        else if(vm.audience == 'Choose'){
          for(var index=0 ;index < vm.societyUserList.length ; index++){
            if(vm.societyUserList[index].checked)
              vm.notice.audience.push(vm.societyUserList[index]);
          }
        }
        if(vm.sms == true)
          vm.notice.communicationType.push('SMS');

        if(vm.email == true)
          vm.notice.communicationType.push('EMAIL');

        if(vm.mobileNotification == true)
          vm.notice.communicationType.push('MOBILE_NOTIFICATION');

        if(vm.notice.activationTime != null || vm.notice.activationTime != undefined) {
          var editActivationTime = vm.notice.activationTime.split(" ")
          if(editActivationTime[editActivationTime.length-1] == 'AM' || editActivationTime[editActivationTime.length-1] == 'PM'){
            var editTime = editActivationTime[editActivationTime.length-2].split(":");
            if(editActivationTime[editActivationTime.length-1] == 'AM' && parseInt(editTime[0]) > 11)
              editTime[0] = parseInt(editTime[0]) - 12;
            if(editActivationTime[editActivationTime.length-1] == 'PM')
              editTime[0] = parseInt(editTime[0]) + 12;

            if(editActivationTime[1] == 'Jan')
              editActivationTime[1] = 0
            if(editActivationTime[1] == 'Feb')
              editActivationTime[1] = 1
            if(editActivationTime[1] == 'Mar')
              editActivationTime[1] = 2
            if(editActivationTime[1] == 'Apr')
              editActivationTime[1] = 3
            if(editActivationTime[1] == 'May')
              editActivationTime[1] = 4
            if(editActivationTime[1] == 'Jun')
              editActivationTime[1] = 5
            if(editActivationTime[1] == 'Jul')
              editActivationTime[1] = 6
            if(editActivationTime[1] == 'Aug')
              editActivationTime[1] = 7
            if(editActivationTime[1] == 'Sep')
              editActivationTime[1] = 8
            if(editActivationTime[1] == 'Oct')
              editActivationTime[1] = 9
            if(editActivationTime[1] == 'Nov')
              editActivationTime[1] = 10
            if(editActivationTime[1] == 'Dec')
              editActivationTime[1] = 11

            vm.notice.activationTime = new Date(editActivationTime[3], editActivationTime[1],editActivationTime[2],editTime[0],editTime[1]);
          }
        }

        noticeFactory.updateNotice(vm.notice ,vm.notice.id).then(function (response) {

          if (response.status == 200) {
            toaster.info('Notice Updated');
            vm.message = "Notice updated";
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
          else if( response.status == 401){
            $state.go('auth.signout')
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
        toaster.error('Attachment Not Saved');
        console.info('onErrorItem', fileItem, response, status, headers);
      };
      uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
      };
      uploader.onCompleteItem = function (fileItem, response, status, headers) {
        toaster.info('Attachment Saved');
        console.info('onCompleteItem', fileItem, response, status, headers);
      };
      uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
      };

      uploader.cancelAll = function(){
        for(var item = 0; item<uploader.queue.length ; item++){
          uploader.queue[item].remove();
        }
        vm.notice.attachmentUrl = [];
      };


      uploader.clearQueue = function(){
        for(var item = 0; item<uploader.queue.length ; item++){
          uploader.queue[item].remove();
        }
        vm.notice.attachmentUrl = [];
      };

      vm.deleteFromList = function (item) {
        if(vm.notice.attachmentUrl != undefined && vm.notice.attachmentUrl[item] != undefined){
          if (item > -1) {
            vm.notice.attachmentUrl.splice(item, 1);
          }
        }
      };

      vm.deleteFromDb = function (item) {
        if(vm.notice.attachmentUrl != undefined && vm.notice.attachmentUrl[item] != undefined){
          if (item > -1) {
            vm.notice.attachmentUrl.splice(item, 1);
          }
        }
      };

      // console.info('uploader', uploader);

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
      $scope.schedule.push($filter('date')(new Date($scope.date),'yyyy-MM-dd'));
      $scope.schedule.push($filter('date')(new Date($scope.time),'hh:mm:a'));
      $uibModalInstance.close($scope.schedule);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
