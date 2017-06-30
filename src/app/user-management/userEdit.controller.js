
(function () {
  'use strict';

  angular
    .module('app.user')
    .controller('UserEditCtrl', UserEditCtrl);

  UserEditCtrl.$inject = ['userFactory', '$localStorage', '$document', '$state', 'validationHelperFactory', '$stateParams', 'toaster', 'role'];
  /* @ngInject */
  function UserEditCtrl( userFactory, $localStorage, $document, $state, validationHelperFactory, $stateParams , toaster, role) {
    var vm = this;
    vm.submit = submit;
    vm.reset = reset;
    vm.findSociety = findSociety;

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

      userFactory.getRole().then(function (response) {
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
          console.log(vm.rolesList)
          console.log(vm.roles)
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

      userFactory.finduser($stateParams.id).then(function (response) {
        if (response.status == 200) {
          vm.user = response.data;
          for(var i=0; i<vm.roles.length; i++){
            if(vm.roles[i] == vm.user.role){
              vm.user.role = vm.rolesList[i];
            }
          }
          console.log(vm.user)
          findSociety();
        }
        else if (response.status == -1) {
          toaster.error('Network Error');
          vm.errorMessage = "Network Error";
          console.error(response);
        }
        else if (response.status == 400) {
          console.error(response);
          vm.errorMessage = vm.master.message;
          toaster.error(vm.master.message);
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
        else {
          toaster.error('Some problem', 'error');
          console.error(response);
        }

        // userFactory.findSociety(vm.user.societyId).then(function(response){
        //     if(response.status == 200){
        //       vm.societyy = response.data;
        //       vm.societyy.name = vm.societyy.name
        //       console.log(vm.society)
        //       //vm.user.name = vm.user.society.name;
        //     }
        //     else if(response.status == 401){
        //       $state.go('auth.signout')
        //     }
        //   });

      });

    };

    function findSociety(){
      userFactory.societyList().then(function (response) {
        if(response.status == 200) {
          vm.society = response.data;
          for(var i=0; i<vm.society.length; i++) {
            if(vm.society[i].id == vm.user.societyId){
              vm.user.society = vm.society[i];
              console.log(vm.user.society)
            };
          }
          console.log(vm.society)
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });
    }

    function reset() {
      // vm.user = '';
      activate($stateParams.id)
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    function submit() {
      var firstError = null;

      for(var index=0 ; index < vm.rolesList.length ; index++){
        console.log(vm.user.role)
        if(vm.rolesList[index] == vm.user.role)
          vm.user.role = vm.roles[index];
      }

      if (vm.Form.name.$invalid || vm.Form.email.$invalid || vm.Form.mobile.$invalid || vm.Form.roles.$invalid) {

        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      }
      else if(vm.isSuperAdminRole && vm.user.role=="ROLE_ADMIN" && vm.Form.society.$invalid || vm.isSuperAdminRole && vm.user.role=="ROLE_MANAGEMENT" && vm.Form.society.$invalid)
      {
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;
      }
      else {
        if(vm.user.society != undefined){
          vm.user.societyId = vm.user.society.id;
        }
        userFactory.update($stateParams.id, vm.user).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            toaster.info('User updated');
            $state.go('app.allUsers');
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
            vm.errorMessage = 'Some problem';
            toaster.error('Some problem', 'error');
            console.error(response);
          }
          vm.resetDisabled = false;
          vm.submitDisabled = false;
        });
      }
    };
  }
})();

