(function () {
  'use strict';

  angular
    .module('app.nav')
    .controller('NavController', NavController);

  NavController.$inject = ['$q', 'toaster', '$localStorage', 'role'];
  /* @ngInject */
  function NavController($q, toaster, $localStorage, role) {
    var vm = this;

    activate();

    function activate() {
      vm.isAdminRole = role.isAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isConsumerRole = role.isConsumerRole();
      vm.isCreatorRole = role.isCreatorRole();
      vm.isMeterManagementRole = role.isMeterManagementRole();
      
      // vm.ACCESS_LEVEL = ACCESS_LEVEL;

    };
  }
})();
