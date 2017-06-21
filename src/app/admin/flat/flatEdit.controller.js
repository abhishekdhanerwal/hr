
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('FlatEditCtrl', FlatEditCtrl);

  FlatEditCtrl.$inject = [ 'NgTableParams', '$filter', '$document', 'flatFactory', '$state', 'validationHelperFactory', '$stateParams', 'toaster', '$localStorage', '$rootScope'];
  /* @ngInject */
  function FlatEditCtrl( NgTableParams, $filter, $document, flatFactory, $state, validationHelperFactory, $stateParams , toaster, $localStorage, $rootScope) {
    var vm = this;
    vm.submit = submit;
    vm.userList = userList;
    vm.onSelect = onSelect;
    vm.clearUser = clearUser;
    vm.reset = reset;
    vm.data = {};
    vm.noneditableUserDetails = false;

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {
      if($localStorage._identity.societyId != null){
        vm.SocietyFlatData = true;
      }
      else{
        vm.SocietyFlatData = false;
      }
      console.log($localStorage._identity)

      flatFactory.societyList().then(function (response) {
        if(response.status == 200) {
          vm.society = response.data;
          getEditInfo();
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });

      flatFactory.residentType().then(function (response) {
        if(response.status == 200) {
          vm.residentType = response.data;
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });

    };

    function getEditInfo(){
      flatFactory.findFlat($stateParams.id).then(function (response) {
        if (response.status == 200) {
          vm.flat = response.data;
          if(vm.flat.residentType == 'Owner'){
            vm.flat.user.name = '';
            vm.flat.user.email = '';
            vm.flat.user.mobile = '';
            console.log('AN')
          }
          else if(vm.flat.residentType == 'Tenant'){
            vm.noneditableUserDetails = true;
            console.log('mm')
          }
          console.log(vm.flat)
          for(var index = 0 ; index < vm.society.length ; index++){
            if(vm.flat.society.id == vm.society[index].id){
              vm.flat.society = vm.society[index];
            }
          };
        }
        else if (response.status == -1) {
          toaster.error('Network Error', 'error');
          vm.errorMessage = "Network Error";
          console.error(response);
        }
        else if (response.status == 400) {
          console.error(response);
          vm.errorMessage = vm.master.message;
          toaster.error(vm.master.message, 'error');
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
        else {
          toaster.error('Some problem', 'error');
          console.error(response);
        }
      });
    };

    function reset() {
      // activate($stateParams.id)
      // activate(vm.flat)
      // vm.Form.$setPristine();
      // vm.Form.$setUntouched();
      angular.copy(vm.data,vm.flat);
      activate(vm.data);
    }

    function userList(val){
      return flatFactory.searchUser(val).then(function (response) {
        if(response.status == 200) {
          var params = {
            query: val
          };
          return response.data.map(function (item) {
            return item;
          })
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });
    }

    function onSelect($item, $model, $label) {
      vm.flat.user.name = $item.name;
      vm.flat.user.email = $item.email;
      vm.flat.user.mobile = $item.mobile;
      vm.flat.user.address = $item.address;
      vm.flat.user.role = $item.role;
      vm.flat.user.id = $item.id;
    };

    function clearUser(){
      vm.flat.user= '';
    }

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    function submit() {
      var firstError = null;
      if(!vm.flat.hasOwner){
        delete vm.flat.ownerName;
        delete vm.flat.ownerMobile;
        delete vm.flat.ownerEmail;
        delete vm.flat.dateOfPossession;
        delete vm.flat.hasResident;
        delete vm.flat.user;
        delete vm.flat.residentType;
      }
      if(!vm.flat.hasResident){
        delete vm.flat.user;
        delete vm.flat.residentType;
      }

      if (vm.Form.$invalid) {

        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        flatFactory.editFlat($stateParams.id, vm.flat).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            console.log(vm.flat.society.id)
            toaster.info('Flat updated');
            vm.message = "Flat updated";
            if(vm.SocietyFlatData) {
              $state.go('app.flatsBySociety',({id: vm.flat.society.id , msg: vm.message}));
            }
            else if(vm.SocietyFlatData == false){
              $state.go('app.flats', {msg: vm.message});
            }
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error', 'error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data[0].message;
            toaster.error(response.data[0].message);
            console.error(response);
          }
          else if( response.status == 401){
            toaster.info("User is not logged in. Redirecting to Login Page");
            $state.go('auth.signout')
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

