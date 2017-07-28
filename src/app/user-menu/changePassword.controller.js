
(function () {
  'use strict';

  angular
    .module('app.userMenu')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$q', 'changePasswordFactory', '$state', 'toaster', 'validationHelperFactory', '$location', '$stateParams', '$localStorage', 'role'];

  function ChangePasswordController($q, changePasswordFactory, $state, toaster, validationHelperFactory, $location, $stateParams, $localStorage, role) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.isAdminRole = role.isAdminRole();
    vm.isSuperAdminRole = role.isSuperAdminRole();
    vm.isConsumerRole = role.isConsumerRole();
    vm.isManagementRole = role.isManagementRole();
    vm.isCreatorRole = role.isCreatorRole();
    vm.isMeterManagementRole = role.isMeterManagementRole();

    function breadcrumbRoute() {
      if(vm.isSuperAdminRole || vm.isMeterManagementRole) {
        $state.go('app.complaint')
      }
      else if(vm.isCreatorRole){
        $state.go('app.society')
      }
      else{
        $state.go('app.notice')
      }
    }

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    vm.passData = {};
    console.log($localStorage._identity)
    if($localStorage._identity){
      var userid = $localStorage._identity.principal.id;
    }

    vm.submit = function () {
      vm.passData.password = vm.password;
      console.log(vm.passData.password)
      vm.passData.newPassword = vm.newPassword;
      vm.passData.id = userid;

      var firstError = null;
      //console.log(vm.Form)
      if (vm.Form.$invalid) {
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;
      }
      else {
        console.log(vm.passData);
        changePasswordFactory.change(vm.passData, userid).then(function (response) {

          if (response.status == 200) {
            toaster.info('Password Changed', 'default');
            $state.go('auth.signin');
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error', 'error');
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
            vm.errorMessage = response.data[0].message;
            toaster.error(response.data[0].message, 'error');
            console.error(response);
          }
        });

      }
    }

  }
}());

