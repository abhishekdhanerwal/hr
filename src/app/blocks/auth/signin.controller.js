(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .controller('SigninController', SigninController);

  SigninController.$inject = ['$scope', '$state', 'validationHelperFactory', 'toaster', '$localStorage', '$timeout', 'ngNotify' ,'$http'];
  /* @ngInject */
  function SigninController($scope, $state, validationHelperFactory, toaster, $localStorage, $timeout, ngNotify , $http) {
    var vm = this;

    vm.continue = function(){
      if(vm.FormDomain.$invalid){
        validationHelperFactory.manageValidationFailed(vm.FormDomain);
        ngNotify.set('Oops !! You can not proceed without Company Name', {
          type: 'error',
          duration: 3000
      })
        return;
      }else {
        $state.go('auth.validate');
      }
    }

    vm.signin = function(){
      if(vm.validateForm.$invalid){
        validationHelperFactory.manageValidationFailed(vm.validateForm);
        if(vm.validateForm.email.$invalid && vm.validateForm.password.$invalid)
          vm.msg = "Email & Password are not correct ";
        else if(vm.validateForm.email.$invalid && !vm.validateForm.password.$invalid)
          vm.msg =  "Email is not correct ";
        else 
          vm.msg =  "Password is not correct ";
        ngNotify.set(vm.msg, {
          type: 'error',
          duration: 3000
      })
        return;
      } else {

      }
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
