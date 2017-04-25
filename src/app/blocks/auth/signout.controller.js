/**
 * Created by Pooja on 4/20/2017.
 */

(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .controller('SignoutController', SignoutController);

  SignoutController.$inject = ['$state', 'principal', 'logger'];
  /* @ngInject */
  function SignoutController($state, principal, logger) {
    var vm = this;

    activate();

    function activate() {
      principal.signout();
      $state.go('auth.signin');
    }
  }
})();
