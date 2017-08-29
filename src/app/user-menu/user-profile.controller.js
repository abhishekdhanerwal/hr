
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
    vm.imageProgress = true;
    vm.isAdminRole = role.isAdminRole();
    vm.isSuperAdminRole = role.isSuperAdminRole();
    vm.isConsumerRole = role.isConsumerRole();
    vm.isManagementRole = role.isManagementRole();
    vm.isCreatorRole = role.isCreatorRole();
    vm.isMeterManagementRole = role.isMeterManagementRole();
    vm.isVisitorAdminRole = role.isVisitorAdminRole();

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

    vm.saveImage = function () {
      vm.imageProgress = true;
      var formData = new FormData();
      formData.append('file', vm.obj.flow.files[0].file);
      $http.post(__env.dataServerUrl + "/fileUpload/helperImageUpload", formData, {
        data: formData,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        },
        transformResponse: [function (data, headers) {
          return data;
        }]
      }).success(function (response) {
        console.log(response)
        vm.imageProgress = false;
        vm.user.profilePicUrl = response;
        $rootScope.$broadcast('refreshImage' , vm.user.profilePicUrl);
        toaster.success("File uploaded successfully");

      }).error(function (response) {
        vm.errorMessage = "File upload error";
        console.log(response)
        toaster.error("File upload error");
      });
    };

    vm.removeImage = function () {
      //vm.user = {};
      console.log(vm.user.profilePicUrl)
      vm.noImage = true;
      vm.user.profilePicUrl = null;
    };

    function reset() {
      activate(vm.userID);
      vm.errorMessage = false;
      vm.message = false;
    }

    function activate(id) {

        userProfileFactory.viewuser(id).then(function (response) {
          if (response.status == 200) {
            if (response.data != null) {
              vm.imageProgress = false;
              vm.master = response.data;
              vm.user = angular.copy(vm.master);
              console.log(vm.user)

              if(vm.user.profilePicUrl) {
                var random = (new Date()).toString();
                vm.user.profilePicUrl = vm.user.profilePicUrl + "?cb=" + random;
              }
              else {
                vm.noImage = true;
              }
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
            if(vm.user!=undefined){
              vm.user.address = 'Tower:' + response.data.tower + ',Flat No:' + response.data.flatNo;
            }
          }
          else if(response.status == 401){
            $state.go('auth.signout')
          }
        })
    }

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
            $rootScope.user = response.data;
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
    }
  }
})();

