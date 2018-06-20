(function () {
    'use strict';
  
    angular
      .module('blocks.auth')
      .controller('AuthController', AuthController);
  
      AuthController.$inject = ['$scope', '$state', 'principal', 'toaster', '$localStorage', '$timeout', 'role'];
    /* @ngInject */
    function AuthController($scope, $state, principal, toaster, $localStorage, $timeout, role) {
      var vm = this;
  
      activate();
  
      function activate() {
        
      }
    }
  })();
  