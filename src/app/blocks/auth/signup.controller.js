(function () {
    'use strict';
  
    angular
      .module('blocks.auth')
      .controller('SignupController', SignupController);
  
      SignupController.$inject = ['$scope', '$state', 'validationHelperFactory', 'ngNotify', '$localStorage', 'jwtHelper', 'principal' , '$window'];
    /* @ngInject */
    function SignupController($scope, $state, validationHelperFactory, ngNotify, $localStorage, jwtHelper , principal , $window) {
      var vm = this;
      vm.hideSignUp = false;
      console.log($window.localStorage['NG_TRANSLATE_LANG_KEY'])
  
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
                  var payload = {
                    "username":vm.user.email,
                    "password":vm.user.password
                  }
                  principal.signin(payload).then(function(responseSignIn){
                    if (responseSignIn.status == 200) {
                      var userDetails = jwtHelper.decodeToken(responseSignIn.data.access_token);
                      $localStorage._identity = {
                        "access_token" : responseSignIn.data.access_token,
                        "userDetails" : userDetails,
                        "userInfo" : response.data.data
                      };
                      console.log($localStorage)
                      
                      $state.go('company.goal');
                    }
                    else if (responseSignIn.status == -1) {
                      // vm.errorMessage = 'Network Error';
                      // toaster.error('Network Error', 'error');
                      // console.error(response);
                    }
                    else if (responseSignIn.status == 400) {
                      // vm.errorMessage = response.data[0].message;
                      // toaster.error(response.data[0].message, 'error');
                      // console.error(response);
                    }
                    else if( responseSignIn.status == 401){
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
                  // $state.go('company.goal');
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
  