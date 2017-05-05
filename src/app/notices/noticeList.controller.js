
(function () {
  'use strict';

  angular
    .module('app.notice')
    .controller('NoticeListCtrl', NoticeListCtrl);

  NoticeListCtrl.$inject = ['$state', 'validationHelperFactory', 'toaster'];
  /* @ngInject */
  function NoticeListCtrl($state, validationHelperFactory , toaster) {
    var vm = this;
    vm.submit = submit;
    vm.reset = reset;

    // activate();
    //
    // function activate() {
    //   complaintFactory.loadTypeDetails().then(function (response) {
    //     vm.complaintType = response.data;
    //     console.log(vm.complaintType)
    //   })
    // };

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

