(function () {
  'use strict';

  angular
    .module('app.user')
    .controller('CreateUserController', CreateUserController);

  CreateUserController.$inject = ['$q', 'userFactory', 'SweetAlert', '$state', '$http', 'toaster', 'validationHelperFactory', '$stateParams', '$localStorage'];

  function CreateUserController($q, userFactory, SweetAlert, $state, $http, toaster, validationHelperFactory, $stateParams, $localStorage) {
    var vm = this;
    vm.reset = reset;
    vm.user = {};

    activate();

    function activate() {
      userFactory.getRole().then(function (response) {
        vm.roles = response.data;
      });
    };

    vm.submit = function () {

      var firstError = null;
      if (vm.Form.$invalid) {
        validationHelperFactory.manageValidationFailed(vm.Form);
        return;
      }
      else {
        userFactory.save(vm.user).then(function (response) {
          if (response.status == 201) {
            console.log(response)
            toaster.info('user Saved', 'default');
          }
          else if (response.status == -1) {
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            toaster.error(response.data[0].message, 'error');
            console.error(response);
          }
          else {
            toaster.error('Some problem', 'error');
            console.error(response);
          }
        });
      }
    };

    function reset() {

      vm.user.name = null;
      vm.user.email = null;
      vm.user.mobile = null;
      vm.user.designation = null;
      vm.user.mobile = null;
      vm.user.state = null;
      vm.user.city = null;
      vm.user.address = null;
      vm.user.gender = null;
      vm.user.role = null;
      vm.user.owner = null;
      vm.user.tenant = null;


      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    };
  }
}());

