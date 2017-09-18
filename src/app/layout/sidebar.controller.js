(function () {
  'use strict';

  angular
    .module('app.nav')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$rootScope','$localStorage', 'role' , '$scope' , '$timeout' , 'principal' , '$state' ];
  /* @ngInject */
  function SidebarController($rootScope  , $localStorage, role  , $scope , $timeout , principal , $state) {
    var vm = this;

    var random = (new Date()).toString();

    activate();

    function activate() {
      role.isAdminRole();
      if($localStorage._identity !=null){
        $rootScope.user = $localStorage._identity.principal;
        vm.profilePicUrl = $localStorage._identity.principal.profilePicUrl;
        vm.roleName = $localStorage._identity.principal.role;
        console.log($localStorage._identity.principal)
        if(vm.roleName == "ROLE_CONSUMER") {
          vm.roleName = "CONSUMER";
        }
        else if(vm.roleName == "ROLE_SUPER_ADMIN"){
          vm.roleName = "SUPER ADMIN";
        }
        else if(vm.roleName =="ROLE_MANAGEMENT"){
          vm.roleName = "MANAGEMENT";
        }
        else if(vm.roleName == "ROLE_ADMIN"){
          vm.roleName = "ADMIN";
        }
        else if(vm.roleName == "ROLE_SOCIETY_CREATOR"){
          vm.roleName = "CREATOR";
        }
        else if(vm.roleName == "ROLE_METER_MANAGEMENT"){
          vm.roleName = "METER MANAGER";
        }
        else if(vm.roleName == "ROLE_VISITOR_ADMIN"){
          vm.roleName = "VISITOR ADMIN";
        }
      }
    };

    $scope.$on('refreshImage' , function (event , data) {
      $timeout( function(){
        var random = (new Date()).toString();
        vm.profilePicUrl = data + "?cb=" + random;
      }, 9000);
    })

    vm.signout = function() {
      principal.signout();
      $state.go('auth.signin');
    }
  }
})();

