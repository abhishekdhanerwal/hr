(function () {
  'use strict';

  angular
    .module('app.user')
    .controller('CreateUserController', CreateUserController);

  CreateUserController.$inject = ['$q', 'userFactory', 'role', '$document', 'SweetAlert', '$state', '$http', 'toaster', 'validationHelperFactory', '$stateParams', '$localStorage'];

  function CreateUserController($q, userFactory, role, $document, SweetAlert, $state, $http, toaster, validationHelperFactory, $stateParams, $localStorage) {
    var vm = this;
    vm.reset = reset;
    vm.user = {};

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    vm.hideUserBox = function () {
      $stateParams.msg = false;
    }

    activate();

    function activate() {

      vm.isAdminRole = role.isAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isConsumerRole = role.isConsumerRole();

      userFactory.societyList().then(function (response) {
        if(response.status == 200){
          vm.society = response.data;
          // for(var i=0; i<vm.society.length; i++) {
          //   vm.user.SocietyId = vm.society.id;
          // }
          console.log(vm.society)
        }
        else if( response.status == 401){
          toaster.info("User is not logged in. Redirecting to Login Page");
          $state.go('auth.signout')
        }
      });

      userFactory.findSociety($localStorage._identity.principal.societyId).then(function(response){
        if(response.status == 200){
          vm.user.society = response.data;
          vm.user.societyId = vm.user.society.societyId;
        }
        else if(response.status == 401){
          $state.go('auth.signout')
        }
      });

      userFactory.getRole().then(function (response) {
        if(response.status == 200) {
          vm.roles = response.data;
          console.log(vm.roles)
          vm.roles.splice(0, 1);
          if (vm.isSuperAdminRole) {
            vm.roles.splice(3, 5);
          }
          else if(vm.isAdminRole){
            vm.roles.splice(1,2);
          }
          else if(vm.isManagementRole){
            vm.roles.splice(0,3);
          }
        }
        else if( response.status == 401){
          toaster.info("User is not logged in. Redirecting to Login Page");
          $state.go('auth.signout')
        }
      });
    };

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    vm.submit = function () {

      var firstError = null;
      if (vm.Form.name.$invalid || vm.Form.email.$invalid || vm.Form.mobile.$invalid || vm.Form.roles.$invalid) {
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;
      }
      else if(vm.isSuperAdminRole && vm.Form.society.$invalid)
      {
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;
      }
      else {
        if(vm.user.society != undefined){
        vm.user.societyId = vm.user.society.id;
        }
        userFactory.save(vm.user).then(function (response) {
          console.log(vm.user);
          if (response.status == 201) {
            console.log(response)
            toaster.info('User Saved');
            vm.message = "User Saved"
            $state.go('app.allUsers',{msg:vm.message})
          }
          else if (response.status == -1) {
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data[0].message;
            toaster.error(response.data[0].message);
            console.error(response);
          }
          else if( response.status == 401){
            toaster.info("User is not logged in. Redirecting to Login Page");
            $state.go('auth.signout')
          }
          else {
            toaster.error('Some problem', 'error');
            console.error(response);
          }
        });
      }
    };

    function reset() {

      vm.user.name = null;
      vm.user.email = null;
      vm.user.mobile = null;
      vm.user.designation = null;
      vm.user.mobile = null;
      vm.user.state = null;
      vm.user.city = null;
      vm.user.address = null;
      vm.user.gender = null;
      vm.user.role = null;
      vm.user.owner = null;
      vm.user.tenant = null;


      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    };
  }
}());

