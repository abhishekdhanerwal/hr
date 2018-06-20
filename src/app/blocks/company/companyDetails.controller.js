(function () {
    'use strict';
  
    angular
      .module('blocks.auth')
      .controller('CompanyDetailsController', CompanyDetailsController);
  
      CompanyDetailsController.$inject = ['$scope', '$state', 'principal', 'toaster', '$localStorage', '$timeout', 'role'];
    /* @ngInject */
    function CompanyDetailsController($scope, $state, principal, toaster, $localStorage, $timeout, role) {
      var vm = this;
  
      activate();
  
      function activate() {
      }

      vm.detailsSubmit = function(){
          $state.reload();
        //   $state.go('company.teams',{},{reload: true})
      }

      vm.goalRefreshPage = function(){
        $state.reload();
        // $state.go("company.details");
      }
    }
  })();
  