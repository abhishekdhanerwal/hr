(function () {
  'use strict';

  angular
    .module('app.nav')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$localStorage', 'role' , '$scope' , '$timeout' , 'principal' , '$state' ];
  /* @ngInject */
  function SidebarController($localStorage, role  , $scope , $timeout , principal , $state) {
    var vm = this;

    var random = (new Date()).toString();
    // $localStorage._identity.userDetails.profilePictureUrl = $localStorage._identity.userDetails.profilePictureUrl + "?cb=" + random;

    activate();

    function activate() {
      role.isAdminRole();
      console.log( role.isAdminRole())
      vm.name = $localStorage._identity.principal.name;
      console.log($localStorage._identity)
      // vm.profilePictureUrl = $localStorage._identity.userDetails.profilePictureUrl;
      vm.roleName = $localStorage._identity.principal.role;
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
    };

    $scope.$on('refreshImage' , function (event , data) {
      $timeout( function(){
        var random = (new Date()).toString();
        vm.profilePictureUrl = data + "?cb=" + random;
      }, 9000);
    })

    vm.signout = function() {
      principal.signout();
      $state.go('auth.signin');
    }
  }
})();

