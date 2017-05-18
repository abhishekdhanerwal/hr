
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('FlatNewCtrl', FlatNewCtrl);

  FlatNewCtrl.$inject = [ 'NgTableParams', '$filter', '$document', 'societyFactory', 'flatFactory', '$state', 'validationHelperFactory', 'toaster', 'userFactory'];
  /* @ngInject */
  function FlatNewCtrl( NgTableParams, $filter, $document, societyFactory, flatFactory, $state, validationHelperFactory , toaster, userFactory) {
    var vm = this;
    vm.userTenant = false;
    vm.submit = submit;
    vm.reset = reset;
    // vm.residentData = residentData;
    vm.userList = userList;
    vm.onSelect = onSelect;
    vm.clearUser = clearUser;
    vm.addUser = addUser;

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {

      societyFactory.societyList().then(function (response) {
        vm.society = response.data;
      });

        flatFactory.residentType().then(function (response) {
          vm.residentType = response.data;
        });

      flatFactory.getRole().then(function (response) {
        vm.roles = response.data;
      });
    };

    function reset() {
      vm.flat = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    // function residentData() {
    //   if(vm.flat.hasOwner || vm.flat.hasResident) {
    //     vm.flat.residentType = '';
    //     // vm.flat.user.selected = '';
    //     vm.flat.user.name = '';
    //     vm.flat.user.email = '';
    //     vm.flat.user.mobile = '';
    //   }
    // }

    function userList(val){
      return flatFactory.searchUser(val).then(function (response) {
        var params = {
          query:val
        };
        return response.data.map(function (item) {
          return item;
        })
      });
    }

    function onSelect($item, $model, $label) {
      vm.flat.user.name = $item.name;
      vm.flat.user.email = $item.email;
      vm.flat.user.mobile = $item.mobile;
      vm.flat.user.address = $item.address;
      vm.flat.user.role = $item.role;
    };

    function clearUser(){
      vm.flat.user= {};
    }

    function addUser(){
      vm.userTenant = true;
    }

    function submit() {
      var firstError = null;

      if (vm.Form.$invalid) {

        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        flatFactory.newFlat(vm.flat.society.id, vm.flat).then(function (response) {
          console.log(vm.flat.society.id);

          if (response.status == 200) {
            toaster.info('Flat Created');
            $state.go('app.flats');
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data.message;
            toaster.error(response.data.message);
            console.error(response);
          }
          else {
            vm.errorMessage = 'Some problem';
            toaster.error('Some problem', 'error');
            console.error(response);
          }
        });
      }
    };
  }
})();

