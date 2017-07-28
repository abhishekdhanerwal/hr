
(function () {
  'use strict';

  angular
    .module('app.userMenu')
    .controller('UserProfileCtrl', UserProfileCtrl);

  UserProfileCtrl.$inject = ['$http' , 'flowFactory', 'toaster', 'validationHelperFactory', '$localStorage', 'userProfileFactory', '$state'  ,'$scope' ,'$rootScope', 'role'];

  function UserProfileCtrl($http , flowFactory, toaster, validationHelperFactory, $localStorage,  userProfileFactory, $state  , $scope , $rootScope, role) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.reset = reset;
    vm.isCreatorRole = role.isCreatorRole();

    function breadcrumbRoute() {
      if(!vm.isCreatorRole) {
        $state.go('app.notice')
      }
      else{
        $state.go('app.society')
      }
    }
    // vm.removeImage = function () {
    //   vm.noImage = true;
    //   vm.user.profilePictureUrl = null;
    // };

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    if($localStorage._identity)
    {
      vm.userID = $localStorage._identity.principal.id;
    }

    activate(vm.userID);

    function reset() {
      activate(vm.userID);
      vm.errorMessage = false;
      vm.message = false;
    }

    function activate(id) {

        userProfileFactory.viewuser(id).then(function (response) {
          if (response.status == 200) {
            console.log(response.data)
            if (response.data != null) {
              vm.master = response.data;
              vm.user = angular.copy(vm.master);
              console.log(vm.user)
            }

          }
          else if (response.status == 404) {
            vm.errorMessage = 'User not found';
            toaster.error('User not found');
            console.error(response);
          }
          else if( response.status == 401){
            $state.go('auth.signout')
          }
          else if (response.status == -1) {
            toaster.error('Network Error');
            console.error(response);
          }
          else {
            toaster.error('Backend error');
            console.error(response);
          }
          // self.resetDisabled = false;
          // self.submitDisabled = false;
        });

        userProfileFactory.userAddress(id).then(function(response){
          if(response.status == 200){
            vm.user.address = 'Tower:' + response.data.tower + ',Flat No:' + response.data.flatNo;
          }
          else if(response.status == 401){
            $state.go('auth.signout')
          }
        })
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
      if (vm.Form.name.$invalid || vm.Form.email.$invalid || vm.Form.mobile.$invalid) {
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = "Validation error";
        return;
      }
      else {
        userProfileFactory.edit(vm.userID, vm.user).then(function (response) {
          console.log(vm.user)
          if (response.status == 200) {
            $localStorage._identity.userDetails = response.data;
            console.log(response.data);
            toaster.info('User Saved');
            $state.go('app.notice')
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data[0].message;
            toaster.error(response.data[0].message);
            console.error(response);
          }
          else if( response.status == 401){
            $state.go('auth.signout')
          }
          else {
            toaster.error('Some problem');
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

