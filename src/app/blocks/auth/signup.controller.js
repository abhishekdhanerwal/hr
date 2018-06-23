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
          principal.signup(vm.user).then(function(response){
                console.log(response)
                if (response.status == 200) {
                  $state.go('company.goal');
                }
                else if (response.status == -1) {
                  // vm.errorMessage = 'Network Error';
                  // toaster.error('Network Error', 'error');
                  // console.error(response);
                }
                else if (response.status == 400) {
                  // vm.errorMessage = response.data[0].message;
                  // toaster.error(response.data[0].message, 'error');
                  // console.error(response);
                }
                else if( response.status == 401){
                  // $state.go('auth.signout')
                }
                else {
                  // vm.errorMessage = 'Some problem';
                  // toaster.error('Some problem', 'error');
                  // console.error(response);
                }
                
          }, function(error){
            console.log(error)

          })
        }
      }
    }
  })();
  