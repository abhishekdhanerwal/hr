(function () {
    'use strict';
  
    angular
      .module('blocks.auth')
      .controller('SignupController', SignupController);
  
      SignupController.$inject = ['$scope', '$state', 'validationHelperFactory', 'ngNotify', '$localStorage', '$timeout', 'principal'];
    /* @ngInject */
    function SignupController($scope, $state, validationHelperFactory, ngNotify, $localStorage, $timeout , principal) {
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
          console.log(vm.user)
          principal.signup(vm.user).then(function(result){
                console.log(result)
                $state.go('company.goal');
          }, function(error){
            console.log(error)

          })
        }
      }
    }
  })();
  