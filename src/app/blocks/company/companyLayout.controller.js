(function () {
    'use strict';
  
    angular
      .module('blocks.auth')
      .controller('CompanyLayoutController', CompanyLayoutController);
  
      CompanyLayoutController.$inject = ['$scope', '$state', 'principal', 'toaster', '$localStorage', '$timeout', 'role'];
    /* @ngInject */
    function CompanyLayoutController($scope, $state, principal, toaster, $localStorage, $timeout, role) {
      var vm = this;
  
      activate();
  
      function activate() {
        console.log($state.current.name)
        if($state.current.name == 'company.goal'){
            vm.goalsSelected = 'selected , inactiveLink';
            vm.detailsSelected = 'inactiveLink';
            vm.teamsSelected = 'inactiveLink';
            vm.slidesSelected = 'inactiveLink';
            vm.membersSelected = 'inactiveLink';
        }
       else if($state.current.name == 'company.details'){
        vm.goalsSelected = 'selected , inactiveLink';
        vm.detailsSelected = 'selected , inactiveLink';
        vm.teamsSelected = 'inactiveLink';
        vm.slidesSelected = 'inactiveLink';
        vm.membersSelected = 'inactiveLink';
      }
      else if($state.current.name == 'company.teams'){
        vm.goalsSelected = 'selected , inactiveLink';
            vm.detailsSelected = 'selected , inactiveLink';
            vm.teamsSelected = 'selected , inactiveLink';
            vm.slidesSelected = 'inactiveLink';
            vm.membersSelected = 'inactiveLink';
       }
       else if($state.current.name == 'company.slides'){
        vm.goalsSelected = 'selected , inactiveLink';
            vm.detailsSelected = 'selected , inactiveLink';
            vm.teamsSelected = 'selected , inactiveLink';
            vm.slidesSelected = 'selected , inactiveLink';
            vm.membersSelected = 'inactiveLink';
      }else if($state.current.name == 'company.documentFolders'){
        vm.goalsSelected = 'selected , inactiveLink';
            vm.detailsSelected = 'selected , inactiveLink';
            vm.teamsSelected = 'selected , inactiveLink';
            vm.slidesSelected = 'selected , inactiveLink';
            vm.membersSelected = 'inactiveLink';
      }
       else if($state.current.name == 'company.members'){
        vm.goalsSelected = 'selected , inactiveLink';
        vm.detailsSelected = 'selected , inactiveLink';
        vm.teamsSelected = 'selected , inactiveLink';
        vm.slidesSelected = 'selected , inactiveLink';
        vm.membersSelected = 'selected , inactiveLink';
        }

      }

    }
  })();
  