
(function () {
  'use strict';

  angular
    .module('app.notice')
    .controller('NoticeListCtrl', NoticeListCtrl);

  NoticeListCtrl.$inject = ['$state', 'validationHelperFactory', 'role', 'toaster' , 'noticeFactory' , '$filter' , '$uibModal' , '$localStorage' , 'SweetAlert'];
  /* @ngInject */
  function NoticeListCtrl($state, validationHelperFactory , role, toaster , noticeFactory , $filter , $uibModal, $localStorage , SweetAlert) {
    var vm = this;
    vm.submit = submit;
    vm.reset = reset;
    vm.progress = true;

    activate();

    function activate() {
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isAdminRole = role.isAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isConsumerRole = role.isConsumerRole();

      noticeFactory.getNotices().then(function (response) {
        vm.noticeList = response.data;
        vm.progress = false;
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
      console.log($localStorage._identity.principal);
      noticeFactory.addReadRecipient(noticeId , $localStorage._identity.principal).then(function (response) {
        console.log(response)
        if (response.status == 200) {
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

    function reset() {
      vm.notice = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    function submit() {
      var firstError = null;

      // if (vm.Form.$invalid) {
      //   validationHelperFactory.manageValidationFailed(vm.Form);
      //   vm.errorMessage = 'Validation Error';
      //   return;
      //
      // }

      var noticeData = vm.Form;
      $state.go('app.notice')
      console.log(noticeData)
    };
  }
})();

(function () {
  'use strict';

  angular
    .module('app.notice')
    .controller('userModalInstanceCtrl', userModalInstanceCtrl);

  userModalInstanceCtrl.$inject = ["$scope", "$uibModalInstance" , "users" , "noticeFactory"];
  /* @ngInject */
  function userModalInstanceCtrl($scope, $uibModalInstance, users , noticeFactory) {
    console.log(users)

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

  readNoticeCtrl.$inject = ["$scope", "$uibModalInstance" , "noticeData" , "noticeFactory"];
  /* @ngInject */
  function readNoticeCtrl($scope, $uibModalInstance, noticeData , noticeFactory) {
    console.log(noticeData)
    $scope.notice = noticeData;
    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
    };
  }
})();

