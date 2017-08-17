
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('SocietyNewCtrl', SocietyNewCtrl);

  SocietyNewCtrl.$inject = [ 'NgTableParams', '$document', '$filter', 'societyFactory', '$state', 'validationHelperFactory', 'toaster', 'role'];
  /* @ngInject */
  function SocietyNewCtrl( NgTableParams, $document, $filter, societyFactory, $state, validationHelperFactory , toaster, role) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.message = false;
    vm.submit = submit;
    // vm.userList = userList;
    // vm.onSelect = onSelect;
    // vm.clearUser = clearUser;
    vm.reset = reset;

    function breadcrumbRoute() {
      if(vm.isMeterManagementRole) {
        $state.go('app.complaint')
      }
      else if(vm.isCreatorRole || vm.isSuperAdminRole){
        $state.go('app.society')
      }
      else if(vm.isVisitorAdminRole){
        $state.go('app.visitor')
      }
      else{
        $state.go('app.notice')
      }
    }

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {
      vm.isAdminRole = role.isAdminRole();
      vm.isSuperAdminRole = role.isSuperAdminRole();
      vm.isConsumerRole = role.isConsumerRole();
      vm.isManagementRole = role.isManagementRole();
      vm.isCreatorRole = role.isCreatorRole();
      vm.isMeterManagementRole = role.isMeterManagementRole();
      vm.isVisitorAdminRole = role.isVisitorAdminRole();
    };

    function reset() {
      vm.society = '';
      vm.society.admin = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    function submit() {
      var firstError = null;

      if (vm.Form.$invalid) {

        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        societyFactory.newSociety(vm.society).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            vm.progress = false;
            toaster.info('Society Created');
            vm.message = "Society Created";
            $state.go('app.society',{msg: vm.message});
          }
          else if (response.status == -1) {
            vm.progress = false;
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.progress = false;
            vm.errorMessage = response.data[0].message;
            toaster.error(response.data[0].message);
            console.error(response);
          }
          else if( response.status == 401){
            vm.progress = false;
            $state.go('auth.signout')
          }
          else {
            vm.errorMessage = 'Some problem';
            toaster.error('Some problem');
            console.error(response);
          }
          vm.resetDisabled = false;
          vm.submitDisabled = false;
        });
      }
    };
  }
})();

