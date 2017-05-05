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
    $localStorage._identity.userDetails.profilePictureUrl = $localStorage._identity.userDetails.profilePictureUrl + "?cb=" + random;

    activate();

    function activate() {
      vm.name = $localStorage._identity.userDetails.firstname;
      console.log($localStorage._identity)
      vm.profilePictureUrl = $localStorage._identity.userDetails.profilePictureUrl;
      vm.roleName = role.getMainRole();

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

