
(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .controller('SignoutController', SignoutController);

  SignoutController.$inject = ['$state', 'principal', 'toaster'];
  /* @ngInject */
  function SignoutController($state, principal, toaster) {
    var vm = this;

       vm.signout = function () {
        principal.signout();
        $state.go('auth.signin');
       }
  }
  })();
