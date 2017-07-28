
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('FlatNewCtrl', FlatNewCtrl);

  FlatNewCtrl.$inject = [ 'NgTableParams', '$localStorage', 'role', '$filter', '$document', 'societyFactory', 'flatFactory', '$state', 'validationHelperFactory', 'toaster', 'userFactory'];
  /* @ngInject */
  function FlatNewCtrl( NgTableParams, $localStorage, role, $filter, $document, societyFactory, flatFactory, $state, validationHelperFactory , toaster, userFactory) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.progress = true;
    vm.userTenant = false;
    vm.submit = submit;
    vm.reset = reset;
    vm.validateDate = validateDate;
    vm.userList = userList;
    vm.onSelect = onSelect;
    vm.clearUser = clearUser;
    vm.addUser = addUser;
    vm.flat = {};
    vm.flat.society = {};

    function breadcrumbRoute(){
      if(vm.isSuperAdminRole || vm.isMeterManagementRole) {
        $state.go('app.complaint')
      }
      else if(vm.isCreatorRole){
        $state.go('app.society')
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

      if($localStorage._identity.societyId != null){
        vm.progress = false;
        vm.SocietyFlatData = true;
        vm.flat.society.id = $localStorage._identity.societyId;
      }
      else{
        vm.progress = false;
        vm.SocietyFlatData = false;
      }

      societyFactory.societyList().then(function (response) {
        if(response.status == 200) {
          vm.progress = false;
          vm.society = response.data;
          console.log(vm.society)
        }
        else if( response.status == 401){
          vm.progress = false;
          $state.go('auth.signout')
        }
      });

      flatFactory.findSociety($localStorage._identity.principal.societyId).then(function(response)
      {
        if (response.status == 200) {
          vm.progress = false;
          vm.flat.society = response.data;
         // vm.flat.society.id = vm.societyById.admin.societyId;
        }
        else if (response.status == 401) {
          vm.progress = false;
          $state.go('auth.signout')
        }
      });

        flatFactory.residentType().then(function (response) {
          if(response.status == 200) {
            vm.progress = false;
            vm.residentType = response.data;
          }
          else if( response.status == 401){
            vm.progress = false;
            $state.go('auth.signout')
          }
        });

      flatFactory.getRole().then(function (response) {
        if(response.status == 200) {
          vm.progress = false;
          vm.roles = response.data;
        }
        else if( response.status == 401){
          vm.progress = false;
          $state.go('auth.signout')
        }
      });
    };

    function validateDate(){
      vm.progress = false;
      vm.minDate = new Date();
      console.log(m.minDate)
    }

    function reset() {
      vm.flat = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    function userList(val){
      return flatFactory.searchUser(val).then(function (response) {
        if(response.status == 200) {
          vm.progress = false;
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
      vm.progress = false;
      vm.flat.user.name = $item.name;
      vm.flat.user.email = $item.email;
      vm.flat.user.mobile = $item.mobile;
      vm.flat.user.address = $item.address;
      vm.flat.user.role = $item.role;
      vm.flat.user.id = $item.id;
    };

    function clearUser(){
      vm.progress = false;
      vm.flat.user= '';
    }

    function addUser(){
      vm.userTenant = true;
    }

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
        vm.progress = false;

        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        flatFactory.newFlat(vm.flat.society.id, vm.flat).then(function (response) {
          console.log(vm.flat.society.id);
          console.log(vm.flat)

          if (response.status == 200) {
            vm.progress = false;
            toaster.info('Flat Created');
            vm.message = "Flat Created";
            if(vm.SocietyFlatData) {
              $state.go('app.flatsBySociety',({id: vm.flat.society.id , msg: vm.message}));
            }
            else if(vm.SocietyFlatData == false){
              $state.go('app.flats', {msg: vm.message});
            }
            // $state.go('app.flats', {msg: vm.message});
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
            console.error( vm.errorMessage);
          }
          else if( response.status == 401){
            $state.go('auth.signout')
          }
          else {
            vm.errorMessage = 'Some problem';
            toaster.error('Some problem');
            console.error(response);
          }
        });
      }
    };
  }
})();

