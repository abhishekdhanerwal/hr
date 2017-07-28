(function () {
  'use strict';

  angular
    .module('app.user')
    .controller('CreateUserController', CreateUserController);

  CreateUserController.$inject = ['$q', 'userFactory', 'role', '$document', 'SweetAlert', '$state', '$http', 'toaster', 'validationHelperFactory', '$stateParams', '$localStorage'];

  function CreateUserController($q, userFactory, role, $document, SweetAlert, $state, $http, toaster, validationHelperFactory, $stateParams, $localStorage) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.reset = reset;
    vm.progress = true;
    vm.user = {};

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

    vm.hideUserBox = function () {
      $stateParams.msg = false;
    }

    activate();

    function activate() {

      vm.isAdminRole = role.isAdminRole();
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isConsumerRole = role.isConsumerRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isCreatorRole = role.isCreatorRole();
      vm.isMeterManagementRole = role.isMeterManagementRole();

      userFactory.societyList().then(function (response) {
        vm.progress = false;
        if(response.status == 200){
          vm.society = response.data;
          // for(var i=0; i<vm.society.length; i++) {
          //   vm.user.SocietyId = vm.society.id;
          // }
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });

      userFactory.findSociety($localStorage._identity.principal.societyId).then(function(response){
        vm.progress = false;
        if(response.status == 200){
          vm.user.society = response.data;
          vm.user.societyId = vm.user.society.societyId;
        }
        else if(response.status == 401){
          $state.go('auth.signout')
        }
      });

      userFactory.getRole().then(function (response) {
        vm.progress = false;
        if(response.status == 200) {
          vm.roles = response.data;
          vm.rolesList = [];
          for(var index=0 ; index<vm.roles.length ; index++){
            var temp = vm.roles[index].split("_");
            if(temp.length > 1){
              var newTemp = "";
              for(var j=1 ; j<temp.length ; j++){
                newTemp = newTemp + temp[j] + " ";
              }
              vm.rolesList.push(newTemp);
            }
            else
              vm.rolesList.push(vm.roles[index]);
          }
          vm.roles.splice(0,1);
          vm.rolesList.splice(0, 1);
          if (vm.isSuperAdminRole) {
            vm.roles.splice(3,4);
            vm.rolesList.splice(3, 4);
          }
          else if(vm.isAdminRole){
            vm.roles.splice(1,2);
            vm.rolesList.splice(1,2);
            for(var i=0; i<vm.rolesList.length; i++)
            {
              if(vm.rolesList[i]=='SOCIETY CREATOR ' && vm.roles[i]=='ROLE_SOCIETY_CREATOR'){
                vm.rolesList.splice(i,1);
                vm.roles.splice(i,1);
              }
            }
          }
          else if(vm.isManagementRole){
            vm.roles.splice(0,3);
            vm.rolesList.splice(0,3);
            for(var i=0; i<vm.rolesList.length; i++)
            {
              if(vm.rolesList[i]=='SOCIETY CREATOR ' && vm.roles[i]=='ROLE_SOCIETY_CREATOR'){
                vm.rolesList.splice(i,1);
                vm.roles.splice(i,1);
              }
            }
          }
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });
    };

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    vm.submit = function () {
      vm.progress = false;

      var firstError = null;
      for(var index=0 ; index < vm.rolesList.length ; index++){
        if(vm.rolesList[index] == vm.userRole)
          vm.user.role = vm.roles[index];
      }
      if (vm.Form.name.$invalid || vm.Form.email.$invalid || vm.Form.mobile.$invalid || vm.Form.roles.$invalid) {
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;
      }
      else if(vm.isSuperAdminRole && vm.user.role=="ROLE_ADMIN" && vm.Form.society.$invalid || vm.isSuperAdminRole && vm.user.role=="ROLE_MANAGEMENT" && vm.Form.society.$invalid || vm.isSuperAdminRole && vm.user.role=="ROLE_METER_MANAGEMENT" && vm.Form.society.$invalid)
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
      vm.userRole = null;


      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    };
  }
}());

