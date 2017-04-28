(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .controller('SigninController', SigninController);

  SigninController.$inject = ['$scope', '$state', 'principal', 'toaster', '$localStorage' ];
  /* @ngInject */
  function SigninController($scope, $state, principal, toaster, $localStorage ) {
    var vm = this;
    vm.signin = signin;

    function signin() {

        principal.signin(vm.user, vm.password).then(function () {

          $state.go('app.complaint');

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
    }
  }
})();
