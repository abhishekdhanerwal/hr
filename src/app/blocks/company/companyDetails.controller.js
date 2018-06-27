(function () {
    'use strict';
  
    angular
      .module('blocks.auth')
      .controller('CompanyDetailsController', CompanyDetailsController);
  
      CompanyDetailsController.$inject = ['$scope', '$state', 'ngNotify', '$filter', '$localStorage', '$uibModal', 'validationHelperFactory'];
    /* @ngInject */
    function CompanyDetailsController($scope, $state, ngNotify, $filter, $localStorage, $uibModal, validationHelperFactory) {
      var vm = this;
      if($localStorage.registerProcess == undefined)
        $localStorage.registerProcess = {};

      if(vm.newTeamName == undefined)
        vm.newTeamName = [];

      if(vm.memberList == undefined)
        vm.memberList = [];
        
        
      
      activate();
  
      function activate() {
        vm.company = {};
        vm.company.companyName = $localStorage._identity.userInfo.companyName;
        console.log($localStorage.registerProcess)
      }

      vm.addMember = function(){
        if(vm.memberForm.$invalid){
          validationHelperFactory.manageValidationFailed(vm.memberForm);
          ngNotify.set('Fill all details correctly !!', {
            type: 'error',
            duration: 3000
        })
          return;
      }else {
        vm.memberList.push(vm.member);
        vm.member = null;
        vm.memberForm.$setPristine();
        vm.memberForm.$setUntouched();
      }
      }

      vm.addTeamBox = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function (teamName) {
            // vm.selected = selectedItem;
            vm.newTeamName.push(teamName);
        }, function () {
            // console.log('Modal dismissed at: ' + new Date());
        });
    };

    vm.removeNewTeam = function(teamName){
      var index = vm.newTeamName.indexOf(teamName);
        if (index > -1) {
          vm.newTeamName.splice(index, 1);
        }       
    }

      vm.teamDetailsNext = function(){
        if(vm.team == undefined){
            ngNotify.set('Select atleast one team', {
              type: 'error',
              duration: 3000
          })
        }else{
          $localStorage.registerProcess.team = vm.team;
          $state.go('company.documentFolders', {}, { reload: true });
        }
      }

      vm.detailsSubmit = function(){
        if(vm.memberList.length <= 0 && vm.memberForm.$invalid){
          ngNotify.set('Atleast One Coworker is Required', {
            type: 'error',
            duration: 3000
        })
          return;
        }
       else if(vm.memberForm.$invalid){
          validationHelperFactory.manageValidationFailed(vm.memberForm);
          ngNotify.set('Fill all details !!', {
            type: 'error',
            duration: 3000
        })
          return;
      }
      else {
        console.log($localStorage)
          $localStorage.registerProcess.memberDetails = vm.company;
        $state.go('app.society', {}, { reload: true });
      }
        
          // ui-sref="company.teams"
        //   $state.go('company.teams',{},{reload: true})
      }

      vm.goalRefreshPage = function(type){
        $localStorage.registerProcess.goal = type;
        $state.go('company.details', {}, { reload: true });
        // $state.go('company.details');
        //$state.reload();
        // $state.go("company.details");
      }
    }
  })();
  

  
  (function () {
    'use strict';
  
    angular
      .module('blocks.auth')
      .controller('ModalInstanceCtrl',ModalInstanceCtrl); 

  ModalInstanceCtrl.$inject = ["$scope", "$uibModalInstance"];
    /* @ngInject */
  function ModalInstanceCtrl($scope, $uibModalInstance) {


  $scope.ok = function () {
      $uibModalInstance.close($scope.teamName);
  };

  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };
}
  })();