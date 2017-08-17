
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('SocietyEditCtrl', SocietyEditCtrl);

  SocietyEditCtrl.$inject = [ 'NgTableParams', '$document', '$filter', 'societyFactory', '$state', 'validationHelperFactory', '$stateParams', 'toaster', 'role'];
  /* @ngInject */
  function SocietyEditCtrl( NgTableParams, $document, $filter, societyFactory, $state, validationHelperFactory, $stateParams , toaster, role) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.progress = true;
    vm.userList = userList;
    vm.onSelect = onSelect;
    vm.clearUser = clearUser;
    vm.submit = submit;
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

      societyFactory.findSociety($stateParams.id).then(function (response) {
        console.log($stateParams.id)
        if (response.status == 200) {
          vm.progress = false;
          vm.society = response.data;
        }
        else if (response.status == -1) {
          vm.progress = false;
          toaster.error('Network Error', 'error');
          vm.errorMessage = "Network Error";
          console.error(response);
        }
        else if (response.status == 400) {
          vm.progress = false;
          console.error(response);
          vm.errorMessage = vm.master.message;
          toaster.error(vm.master.message, 'error');
        }
        else if( response.status == 401){
          vm.progress = false;
          $state.go('auth.signout')
        }
        else {
          toaster.error('Some problem', 'error');
          console.error(response);
        }
      });

    };

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    function userList(val){
        return societyFactory.searchUser(val).then(function (response) {
          if (response.status == 200) {
            vm.progress = false;
            var params = {
              query: val
            };
            return response.data.map(function (item) {
              return item;
            })
          }
          else if (response.status == 401) {
           vm.progress = false;
            $state.go('auth.signout')
          }
        });
    }

    function onSelect($item, $model, $label) {
      vm.progress = false;
      vm.society.admin.name = $item.name;
      vm.society.admin.email = $item.email;
      vm.society.admin.mobile = $item.mobile;
      vm.society.admin.address = $item.address;
      vm.society.admin.role = $item.role;
      vm.society.admin.id = $item.id;
      vm.society.admin.societyId = $item.societyId;
    };

    function clearUser(){
      vm.progress = false;
      vm.society.admin= '';
    }

    function reset() {
      activate($stateParams.id)
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    function submit() {
      var firstError = null;

      if (vm.Form.$invalid) {
        vm.progress = false;

        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        societyFactory.editSociety($stateParams.id, vm.society).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            vm.progress = false;
            toaster.info('Society updated');
            vm.message = "Society updated";
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
            vm.errorMessage = response.data.message;
            toaster.error(response.data.message);
            console.error(response);
          }
          else if (response.status == 401) {
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

