
(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .controller('SignoutController', SignoutController);

  SignoutController.$inject = ['$state', 'principal', 'toaster' , '$localStorage'];
  /* @ngInject */
  function SignoutController($state, principal, toaster , $localStorage) {
    var vm = this;

       vm.signout = function () {
        $localStorage.$reset();
        $state.go('auth.view', {}, { reload: true });
       }
  }
  })();
