
(function () {
  'use strict';

  angular
    .module('app.userMenu')
    .controller('UserProfileCtrl', UserProfileCtrl);

  UserProfileCtrl.$inject = ['$http' , 'flowFactory', 'toaster', 'validationHelperFactory', '$localStorage', 'userProfileFactory', '$state'  ,'$scope' ,'$rootScope'];

  function UserProfileCtrl($http , flowFactory, toaster, validationHelperFactory, $localStorage,  userProfileFactory, $state  , $scope , $rootScope) {
    var vm = this;
    vm.reset = reset;
    // vm.removeImage = function () {
    //   vm.noImage = true;
    //   vm.user.profilePictureUrl = null;
    // };

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    // vm.userID = $localStorage._identity.id;

    activate(vm.userID);

    function reset() {
      activate(vm.userID);
      vm.errorMessage = false;
      vm.message = false;
    }

    function activate(id) {
      userProfileFactory.alluser().then(function (response) {
        if (response.status == 200) {
          if (response.data != null) {
            vm.master = response.data;
            console.log(vm.master)
            for (var i = 0; i < vm.master.length; i++) {
              vm.userId = vm.master[i].id;
              console.log(vm.userId)
            }
          }
        }
        userProfileFactory.viewuser(vm.userId).then(function (response) {
          if (response.status == 200) {
            if (response.data != null) {
              vm.master = response.data;

              vm.user = angular.copy(vm.master);
              console.log(vm.user.name)
            }

          }
          else if (response.status == 404) {
            vm.errorMessage = 'User not found';
            toaster.error('User not found', 'error');
            console.error(response);
          }
          else if (response.status == -1) {
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else {
            toaster.error('Backend error', 'error');
            console.error(response);
          }
          // self.resetDisabled = false;
          // self.submitDisabled = false;
        });
      });
    }
    //vm.user.profilePictureUrl = vm.user.profilePictureUrl + new Date().getTime();

    // vm.saveImage = function () {
    //   vm.imageProgress = true;
    //   var formData = new FormData();
    //   formData.append('file', vm.obj.flow.files[0].file);
    //   $http.post(__env.userServerUrl + "/uploadImage", formData, {
    //     data: formData,
    //     transformRequest: angular.identity,
    //     headers: {
    //       'Content-Type': undefined
    //     }
    //   }).success(function (response) {
    //     vm.imageProgress = false;
    //     vm.user.profilePictureUrl = response[1];
    //     $rootScope.$broadcast('refreshImage' , vm.user.profilePictureUrl);
    //     toaster.success("File uploaded successfully", "Status");
    //
    //   }).error(function (response) {
    //     vm.errorMessage = "File upload error";
    //     console.log(response)
    //     toaster.error("File upload error", "Status");
    //   });
    // };

    vm.submit = function () {
      var firstError = null;
      if (vm.Form.$invalid) {
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = "Validation error";
        return;
      }
      else {
        userProfileFactory.edit(vm.userID).then(function (response) {
          if (response.status == 200) {
            $localStorage._identity.userDetails = response.data;
            console.log(response.data);
            toaster.info('User Saved', 'default');
            if($localStorage._identity.sites.length == 1){
              var siteId = $localStorage._identity.sites[0].id;
              $state.go('app.dashboard' ,({id : siteId}));
            }
            else{
              $state.go('app.dashboardAll');
            }
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data.errors[0].message;
            toaster.error(response.data.errors[0].message, 'error');
            console.error(response);
          }
          else {
            toaster.error('Some problem', 'error');
            console.error(response);
          }
        });

      }
    };

    vm.cancel = function () {
      $state.go('app.complaint');
    }

    vm.fileErrorHandler = function( $file, $message, $flow ) {
      console.log("hi");
    }
  }
})();
