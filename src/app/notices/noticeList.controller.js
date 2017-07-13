
(function () {
  'use strict';

  angular
    .module('app.notice')
    .controller('NoticeListCtrl', NoticeListCtrl);

  NoticeListCtrl.$inject = ['$state', 'validationHelperFactory', 'role', 'toaster' , 'noticeFactory' , '$filter' , '$uibModal' , '$localStorage' , 'SweetAlert'];
  /* @ngInject */
  function NoticeListCtrl($state, validationHelperFactory , role, toaster , noticeFactory , $filter , $uibModal, $localStorage , SweetAlert) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.progress = true;
    vm.noticeTypeList = ['All', 'Festival' , 'Violation' , 'Announcement' , 'Other'];
    vm.noticeType = vm.noticeTypeList[0];

    function breadcrumbRoute() {
      $state.go('app.notice')
    }

    activate();

    function activate() {
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isAdminRole = role.isAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isConsumerRole = role.isConsumerRole();

      noticeFactory.getNotices().then(function (response) {
        if (response.status == 200) {
          vm.masterNoticeList = response.data;
          vm.noticeList = angular.copy(vm.masterNoticeList);
          vm.progress = false;
          if(response.data.length == 0)
          vm.message = "Notice dashboard is empty";
          else
            vm.message = false;
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
    };

    vm.openModalUserList = function (noticeId) {

      for(var index = 0; index < vm.noticeList.length ; index++){
        if(noticeId == vm.noticeList[index].id){
          vm.readUserList = vm.noticeList[index].readRecipient;
          break ;
        }
      }

      var modalInstanceUserList = $uibModal.open({
        templateUrl: 'userList.html',
        controller: 'userModalInstanceCtrl',
        resolve: {
          users: function () {
            return vm.readUserList;
          }
        }
      });

      modalInstanceUserList.result.then(function () {
      });
    };

    vm.addReadRecipient = function (noticeId , notice) {
      var modalInstance = $uibModal.open({
        templateUrl: 'readNotice.html',
        controller: 'readNoticeCtrl',
        resolve: {
          noticeData: function () {
            return notice;
          }
        }
      });
      modalInstance.result.then(function () {
      });
      noticeFactory.addReadRecipient(noticeId , $localStorage._identity.principal).then(function (response) {
        console.log(response)
        if (response.status == 200) {

          activate();
          // $state.reload();
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

    vm.deleteNotice = function (noticeId) {

      SweetAlert.swal({
        title: "Are you sure?",
        text: "You want to change the status!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function (isConfirm) {
        if (isConfirm) {
          noticeFactory.deleteNotice(noticeId).then(function (response) {
            console.log(response)
            if (response.status == 200) {
              toaster.info('Notice Deleted');
              vm.message = "Notice Deleted";
              $state.reload();
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
          // SweetAlert.swal({
          //   title: "Changed!",
          //   text: "Status has been changed.",
          //   type: "success",
          //   confirmButtonColor: "#007AFF"
          //
          // });
        } else {
          // SweetAlert.swal({
          //   title: "Cancelled",
          //   text: "",
          //   type: "error",
          //   confirmButtonColor: "#007AFF"
          // });
        }
      });
    }

    vm.populateNoticeList = function () {
      vm.noticeList = [];
      if(vm.noticeType == 'All'){
        vm.noticeList = vm.masterNoticeList;
      }
      else{
        for(var index = 0;index<vm.masterNoticeList.length ; index++){
          if(vm.noticeType == vm.masterNoticeList[index].type){
            vm.noticeList.push(vm.masterNoticeList[index]);
          }
        }
        if(vm.noticeList.length == 0)
          vm.message = "Notice dashboard is empty";
        else
          vm.message = false;
      }
    }

  }
})();

(function () {
  'use strict';

  angular
    .module('app.notice')
    .controller('userModalInstanceCtrl', userModalInstanceCtrl);

  userModalInstanceCtrl.$inject = ["$scope", "$uibModalInstance" , "users"];
  /* @ngInject */
  function userModalInstanceCtrl($scope, $uibModalInstance, users) {
    $scope.userList = users;

    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
    };
  }
})();

(function () {
  'use strict';

  angular
    .module('app.notice')
    .controller('readNoticeCtrl', readNoticeCtrl);

  readNoticeCtrl.$inject = ["$scope", "$uibModalInstance" , "noticeData" , "$http", "$window"];
  /* @ngInject */
  function readNoticeCtrl($scope, $uibModalInstance, noticeData, $http, $window) {
    // $scope.showImage = [];
    $scope.notice = noticeData;
    for(var index=0 ;index< $scope.notice.attachmentUrl.length ; index++){
      var temp = $scope.notice.attachmentUrl[index].split('.').pop();
      if(temp == 'jpg' ||temp == 'jpeg' ||temp == 'png' ||temp == 'bmp' ||temp == 'gif' || temp == 'tiff'){
        var tempUrl = $scope.notice.attachmentUrl[index];
        $scope.notice.attachmentUrl[index] = {};
        $scope.notice.attachmentUrl[index].url = tempUrl
        $scope.notice.attachmentUrl[index].showImage = true;
      }
      else {
        var downloadUrl = $scope.notice.attachmentUrl[index];
        var tempUrl = $scope.notice.attachmentUrl[index].split("/");
        $scope.notice.attachmentUrl[index] = {};
        $scope.notice.attachmentUrl[index].download = downloadUrl;
        $scope.notice.attachmentUrl[index].url = tempUrl[tempUrl.length-1];
        $scope.notice.attachmentUrl[index].showImage = false;
      }
    }
    console.log($scope.notice.attachmentUrl);



    $scope.downloadAttachment = function(downloadUrl , name){
      $window.open(downloadUrl);
      // $http({method: 'GET', url: downloadUrl}).
      // success(function(data, status, headers, config) {
      //   var anchor = angular.element('<a/>');
      //   anchor.css({display: 'none'}); // Make sure it's not visible
      //   angular.element(document.body).append(anchor); // Attach to document
      //   anchor.attr({
      //     href: 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(data),
      //     target: '_blank',
      //     download: name
      //   })[0].click();
      //
      //   anchor.remove(); // Clean it up afterwards
      // })
    };

    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
    };
  }
})();

