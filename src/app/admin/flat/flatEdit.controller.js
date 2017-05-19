
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('FlatEditCtrl', FlatEditCtrl);

  FlatEditCtrl.$inject = [ 'NgTableParams', '$filter', '$document', 'flatFactory', '$state', 'validationHelperFactory', '$stateParams', 'toaster'];
  /* @ngInject */
  function FlatEditCtrl( NgTableParams, $filter, $document, flatFactory, $state, validationHelperFactory, $stateParams , toaster) {
    var vm = this;
    vm.submit = submit;
    vm.reset = reset;

    vm.hideAlertBox = function () {
      vm.errorMessage = false;
      vm.message = false;
    };

    activate();

    function activate() {
      flatFactory.societyList().then(function (response) {
        vm.society = response.data;
        getEditInfo();
      });

      flatFactory.residentType().then(function (response) {
        vm.residentType = response.data;
      });

    };

    function getEditInfo(){
      flatFactory.findFlat($stateParams.id).then(function (response) {
        if (response.status == 200) {
          vm.flat = response.data;
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
        else {
          toaster.error('Some problem', 'error');
          console.error(response);
        }
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
            toaster.info('Flat updated');
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
          vm.resetDisabled = false;
          vm.submitDisabled = false;
        });
      }
    };
  }
})();

