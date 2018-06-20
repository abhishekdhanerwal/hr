(function () {
    'use strict';
  
    angular
      .module('blocks.auth')
      .controller('SignupController', SignupController);
  
      SignupController.$inject = ['$scope', '$state', 'validationHelperFactory', 'ngNotify', '$localStorage', '$timeout'];
    /* @ngInject */
    function SignupController($scope, $state, validationHelperFactory, ngNotify, $localStorage, $timeout) {
      var vm = this;
      vm.hideSignUp = false;
  
      activate();
  
      function activate() {
      }
      
  

      vm.registeruser = function(){
        if(vm.Form.$invalid){
            validationHelperFactory.manageValidationFailed(vm.Form);
            ngNotify.set('Fill all details !!', {
              type: 'error',
              duration: 3000
          })
            return;
        }
        else {
            $state.go('company.goal');
        }
      }
    }
  })();
  