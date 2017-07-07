
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('HelperNewCtrl', HelperNewCtrl);

  HelperNewCtrl.$inject = [ 'NgTableParams', '$localStorage', 'role', '$filter', '$document', '$state', 'validationHelperFactory', 'toaster'];
  /* @ngInject */
  function HelperNewCtrl( NgTableParams, $localStorage, role, $filter, $document, $state, validationHelperFactory , toaster) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.submit = submit;
    vm.reset = reset;
    vm.addResident = addResident;
    vm.helper = [];
   // vm.progress = true;

    vm.removeImage = function () {
      vm.noImage = true;
      vm.helper.profilePictureUrl = null;
    };

    function breadcrumbRoute(){
      $state.go('app.notice')
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

      // societyFactory.societyList().then(function (response) {
      //   if (response.status == 200) {
      //     vm.society = response.data;
      //     console.log(vm.society)
      //   }
      //   else if (response.status == 401) {
      //     $state.go('auth.signout')
      //   }
      // });
    }

    vm.saveImage = function () {
      vm.imageProgress = true;
      var formData = new FormData();
      formData.append('file', vm.obj.flow.files[0].file);
      $http.post(__env.dataServerUrl + "/uploadImage", formData, {
        data: formData,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).success(function (response) {
        vm.imageProgress = false;
        vm.helper.profilePictureUrl = response[1];
        $rootScope.$broadcast('refreshImage' , vm.helper.profilePictureUrl);
        logger.success("File uploaded successfully", "Status");

      }).error(function (response) {
        vm.errorMessage = "File upload error";
        console.log(response)
        logger.error("File upload error", "Status");
      });
    };

    function addResident(){
      vm.helper.push({ 'residentName' : vm.helper.residentName, 'tower' : vm.helper.tower, 'flatNo': vm.helper.flatNo, 'floor': vm.helper.floor, 'fromDate': vm.helper.fromDate, 'endDate' : vm.helper.endDate});
      vm.helper.residentName = '';
      vm.helper.tower = '';
      vm.helper.flatNo = '';
      vm.helper.floor = '';
      vm.helper.fromDate = '';
      vm.helper.endDate = '';
      console.log(vm.helper)
    }

    vm.removeRow = function (name) {
      var index = -1;
      var comArr = eval(vm.helper);
      for (var i = 0; i < comArr.length; i++) {
        if (comArr[i].name === name) {
          index = i;
          break;
        }
      }
      if (index === -1) {
        alert("Something gone wrong");
      }
      vm.helper.splice(index, 1);
    };

    function reset() {
      vm.helper = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };


    function submit() {

      var firstError = null;
      console.log(vm.helper)

      // if (vm.Form.$invalid) {
      //   validationHelperFactory.manageValidationFailed(vm.Form);
      //   vm.errorMessage = 'Validation Error';
      //   return;
      //
      // } else {
      //
      //   flatFactory.newFlat(vm.flat.society.id, vm.flat).then(function (response) {
      //     console.log(vm.flat.society.id);
      //     console.log(vm.flat)
      //
      //     if (response.status == 200) {
      //       toaster.info('Flat Created');
      //       vm.message = "Flat Created";
      //       if(vm.SocietyFlatData) {
      //         $state.go('app.flatsBySociety',({id: vm.flat.society.id , msg: vm.message}));
      //       }
      //       else if(vm.SocietyFlatData == false){
      //         $state.go('app.flats', {msg: vm.message});
      //       }
      //       // $state.go('app.flats', {msg: vm.message});
      //     }
      //     else if (response.status == -1) {
      //       vm.errorMessage = 'Network Error';
      //       toaster.error('Network Error');
      //       console.error(response);
      //     }
      //     else if (response.status == 400) {
      //       vm.errorMessage = response.data[0].message;
      //       toaster.error(response.data[0].message);
      //       console.error( vm.errorMessage);
      //     }
      //     else if( response.status == 401){
      //       $state.go('auth.signout')
      //     }
      //     else {
      //       vm.errorMessage = 'Some problem';
      //       toaster.error('Some problem');
      //       console.error(response);
      //     }
      //   });
      // }
    };
  }
})();

