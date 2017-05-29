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

    activate();

    function activate() {

      vm.isAdminRole = role.isAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isConsumerRole = role.isConsumerRole();

      userFactory.societyList().then(function (response) {
        vm.society = response.data;
        // for(var i=0; i<vm.society.length; i++) {
        //   vm.user.SocietyId = vm.society.id;
        // }
        console.log(vm.society)
      });

      userFactory.getRole().then(function (response) {
        vm.roles = response.data;
        vm.roles.splice(0,1);
        console.log(vm.roles);
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
      else {
        console.log(vm.user.society)
        if(vm.user.society != undefined){
        vm.user.societyId = vm.user.society.id;
        }
        userFactory.save(vm.user).then(function (response) {
          console.log(vm.user);
          if (response.status == 201) {
            console.log(response)
            toaster.info('User Saved');
            $state.go('app.allUsers')
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

