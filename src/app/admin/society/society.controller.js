
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('SocietyNewCtrl', SocietyNewCtrl);

  SocietyNewCtrl.$inject = [ 'NgTableParams', '$document', '$filter', 'societyFactory', '$state', 'validationHelperFactory', 'toaster', '$rootScope'];
  /* @ngInject */
  function SocietyNewCtrl( NgTableParams, $document, $filter, societyFactory, $state, validationHelperFactory , toaster, $rootScope) {
    var vm = this;
    vm.submit = submit;
    vm.userList = userList;
    vm.onSelect = onSelect;
    vm.clearUser = clearUser;
    vm.reset = reset;
    $rootScope.listMessage = false;

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {

    };

    function userList(val){
      return societyFactory.searchUser(val).then(function (response) {
        var params = {
          query:val
        };
        return response.data.map(function (item) {
          return item;
        })
      });
    }

    function onSelect($item, $model, $label) {
      vm.society.admin.name = $item.name;
      vm.society.admin.email = $item.email;
      vm.society.admin.mobile = $item.mobile;
      vm.society.admin.address = $item.address;
      vm.society.admin.role = $item.role;
      vm.society.admin.id = $item.id;
    };

    function clearUser(){
      vm.society.admin= '';
    }

    function reset() {
      vm.society = '';
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
            toaster.info('Society Created');
            $rootScope.listMessage = "Society created successfully";
            $state.go('app.society');
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data[0].message;
            toaster.error(response.data[0].message, 'error');
            console.error(response);
          }
          else {
            vm.errorMessage = 'Some problem';
            toaster.error('Some problem', 'error');
            console.error(response);
          }
          vm.resetDisabled = false;
          vm.submitDisabled = false;
        });
      }
    };
  }
})();

