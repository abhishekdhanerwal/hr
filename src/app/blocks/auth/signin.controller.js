(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .controller('SigninController', SigninController);

  SigninController.$inject = ['$scope', '$state', 'principal', 'toaster', '$localStorage', '$timeout', 'role'];
  /* @ngInject */
  function SigninController($scope, $state, principal, toaster, $localStorage, $timeout, role) {
    var vm = this;
    vm.signin = signin;

    function signin() {

      principal.signin(vm.user, vm.password).then(function (user) {

        vm.isAdminRole = role.isAdminRole();
        vm.isSuperAdminRole = role.isSuperAdminRole();
        vm.isConsumerRole = role.isConsumerRole();
        vm.isManagementRole = role.isManagementRole();
        vm.isCreatorRole = role.isCreatorRole();
        vm.isMeterManagementRole = role.isMeterManagementRole();
        vm.isVisitorAdminRole = role.isVisitorAdminRole();

        if(vm.isSuperAdminRole || vm.isMeterManagementRole) {
          $state.go('app.complaint')
        }
        else if(vm.isCreatorRole){
          $state.go('app.society')
        }
        else if(vm.isVisitorAdminRole){
          $state.go('app.visitor')
        }
        else{
          $state.go('app.notice')
        }
        }, function () {
          if(vm.user=="" && vm.password!="")
          {
            toaster.error("Username is required");
          }
          else if(vm.password==""&& vm.user!="")
          {
            toaster.error("Password is required");
          }
          else if(vm.user=="" && vm.password=="")
          {
            toaster.error("Username and password are required");
          }
          else {
            toaster.error("Please enter valid credentials");
          }
          console.log(vm.user)
          console.log(vm.password)
        });
      }


    activate();

    function activate() {
      //TODO to be removed;
      vm.user = __env.user;
      vm.password = __env.password;

      $timeout(function () {
        toaster.info("User is not logged in");
      }, 1000);

    }
  }
})();
