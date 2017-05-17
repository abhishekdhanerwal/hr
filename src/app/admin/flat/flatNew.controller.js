
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('FlatNewCtrl', FlatNewCtrl);

  FlatNewCtrl.$inject = [ 'NgTableParams', '$filter', '$document', 'societyFactory', 'flatFactory', '$state', 'validationHelperFactory', 'toaster', 'userFactory'];
  /* @ngInject */
  function FlatNewCtrl( NgTableParams, $filter, $document, societyFactory, flatFactory, $state, validationHelperFactory , toaster, userFactory) {
    var vm = this;
    vm.submit = submit;
    vm.reset = reset;
    vm.userList = userList;
    vm.onSelect = onSelect;
    vm.clearUser = clearUser;

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
    };

    function reset() {
      vm.flat = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    function userList(val){
      flatFactory.searchUser(val).then(function (response) {
        return response.data.map(function (item) {
          return item.name;
        })
      });

      // var apiUrl = __env.dataServerUrl + '/users/search';
      // var headers = {
      //   'X-Requested-With': 'XMLHttpRequest',
      //   // 'Access-Control-Request-Headers' : 'X-Custom-Header',
      //   'Authorization': 'Bearer ' + $localStorage._identity.access_token
      // };
      //
      // var params = {
      //   query: val
      // };
      // var req = {
      //   method: 'GET',
      //   url: apiUrl,
      //   headers: headers,
      //   params: params
      // };
      // return $http(req).then(function (response) {
      //   return response.data.map(function (item) {
      //     return item;
      //   });
      // });
    }

    function onSelect() {
      // vm.user.name = $item.name;
      // vm.user.email = $item.email;
      // vm.user.mobile = $item.mobile;
      // vm.user.address = $item.address;
      // vm.user.role = $item.role;
      userFactory.alluser(item.name).then(function (response) {
        vm.searchUser = response.data;
      });
    };

    function clearUser(){
      vm.flat.name = {};
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

