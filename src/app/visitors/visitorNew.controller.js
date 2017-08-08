
(function () {
  'use strict';

  angular
    .module('app.visitors')
    .controller('VisitorNewCtrl', VisitorNewCtrl);

  VisitorNewCtrl.$inject = [ 'NgTableParams', '$filter', '$document', 'role', 'visitorFactory', '$state', 'validationHelperFactory', 'toaster', '$localStorage'];
  /* @ngInject */
  function VisitorNewCtrl( NgTableParams, $filter, $document, role, visitorFactory, $state, validationHelperFactory , toaster, $localStorage) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.submit = submit;
    vm.reset = reset;

    function breadcrumbRoute() {
      if (vm.isSuperAdminRole || vm.isMeterManagementRole) {
        $state.go('app.complaint')
      }
      else if (vm.isCreatorRole) {
        $state.go('app.society')
      }
      else {
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

      vm.hstep = 1;
      vm.mstep = 15;
      vm.ismeridian = true;

    };

    function reset() {
      vm.visitor = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    function submit() {
        vm.progress = true;

        var firstError = null;

        if (vm.Form.$invalid) {
          vm.progress = false;
          validationHelperFactory.manageValidationFailed(vm.Form);
          vm.errorMessage = 'Validation Error';
          return;

        } else {

          complaintFactory.newVisitor(vm.visitor).then(function (response) {
            console.log(response.data);

            if (response.status == 200) {
              vm.progress = false;
              toaster.info('Visitor created');
              vm.message = "Visitor created";
              $state.go('app.visitor', {msg: vm.message});
            }
            else if (response.status == -1) {
              vm.progress = false;
              vm.errorMessage = 'Network Error';
              toaster.error('Network Error', 'error');
              console.error(response);
            }
            else if (response.status == 400) {
              vm.progress = false;
              vm.errorMessage = response.data[0].message;
              toaster.error(response.data[0].message);
              console.error(response);
            }
            else if (response.status == 401) {
              vm.progress = false;
              $state.go('auth.signout')
            }
            else {
              vm.progress = false;
              vm.errorMessage = 'Some problem';
              toaster.error('Some problem', 'error');
              console.error(response);
            }
            vm.resetDisabled = false;
            vm.submitDisabled = false;
          });
        }
      }
    };
})();

