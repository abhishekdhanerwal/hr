
(function () {
  'use strict';

  angular
    .module('app.notice')
    .controller('NoticeListCtrl', NoticeListCtrl);

  NoticeListCtrl.$inject = ['$state', 'validationHelperFactory', 'role', 'toaster'];
  /* @ngInject */
  function NoticeListCtrl($state, validationHelperFactory , role, toaster) {
    var vm = this;
    vm.submit = submit;
    vm.reset = reset;

    activate();

    function activate() {
      vm.isAdminRole = role.isAdminRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isConsumerRole = role.isConsumerRole();
    };

    function reset() {
      vm.notice = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    function submit() {
      var firstError = null;

      // if (vm.Form.$invalid) {
      //   validationHelperFactory.manageValidationFailed(vm.Form);
      //   vm.errorMessage = 'Validation Error';
      //   return;
      //
      // }

      var noticeData = vm.Form;
      $state.go('app.notice')
      console.log(noticeData)
    };
  }
})();

