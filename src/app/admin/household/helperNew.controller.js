
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('HelperNewCtrl', HelperNewCtrl);

  HelperNewCtrl.$inject = [ 'NgTableParams', 'helperFactory', '$localStorage', 'role', '$filter', '$document', '$state', 'validationHelperFactory', 'toaster'];
  /* @ngInject */
  function HelperNewCtrl( NgTableParams, helperFactory, $localStorage, role, $filter, $document, $state, validationHelperFactory , toaster) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    // vm.flatList = flatList;
    // vm.onSelect = onSelect;
    vm.submit = submit;
    vm.reset = reset;
    // vm.addResident = addResident;
    // vm.helper = [];
    // vm.resident = [];
    // vm.helper.workingAt = [];
   // vm.progress = true;

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

      helperFactory.helperType().then(function (response) {
        if (response.status == 200) {
          vm.typeList = response.data;
          vm.helperTypeList = [];
          for(var i=0; i<vm.typeList.length; i++){
            var temp = vm.typeList[i].split("_");
            if(temp.length > 1){
              var newTemp = "";
              for(var j=0; j<temp.length; j++){
                newTemp = newTemp + temp[j] + " ";
              }
              vm.helperTypeList.push(newTemp);
            }
            else{
              vm.helperTypeList.push(vm.typeList[i]);
            }
          }
        }
        else if (response.status == 401) {
          $state.go('auth.signout')
        }
      });

      // vm.endDateValidation = function () {
      //   vm.endMinDate = vm.resident.fromDate;
      // }
    }

    // function flatList(val){
    //   return helperFactory.searchFlatno(val).then(function (response) {
    //     if(response.status == 200) {
    //       var params = {
    //         query: val
    //       };
    //       return response.data.map(function (item) {
    //         return item;
    //       })
    //     }
    //     else if( response.status == 401){
    //       $state.go('auth.signout')
    //     }
    //   });
    // }
    //
    // function onSelect($item, $model, $label) {
    //   vm.helpers.residentName = $item.residentName;
    //   vm.helpers.tower = $item.tower;
    //   vm.helpers.flatNo = $item.flatNo;
    //   vm.helpers.floor = $item.floor;
    //   vm.helpers.fromDate = $item.fromDate;
    //   vm.helpers.endDate = $item.endDate;
    // };

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

    vm.removeImage = function () {
      vm.helper = {};
      console.log(vm.helper.profilePictureUrl)
      vm.noImage = true;
      vm.helper.profilePictureUrl = null;
    };


    // function addResident(){
    //   var firstError = null;
    //   console.log(vm.Form.residentName)
    //   // if (vm.Form.residentName.$invalid || vm.Form.tower.$invalid || vm.Form.flatNo.$invalid || vm.Form.floor.$invalid || vm.Form.fromDate.$invalid || vm.Form.endDate.$invalid) {
    //   //   validationHelperFactory.manageValidationFailed(vm.Form);
    //   //   vm.errorMessage = 'Validation Error';
    //   //   return;
    //   // }
    //   // else {
    //     vm.helper.workingAt.push({
    //       'residentName': vm.resident.residentName,
    //       'tower': vm.resident.tower,
    //       'flatNo': vm.resident.flatNo,
    //       'floor': vm.resident.floor,
    //       'fromDate': vm.resident.fromDate,
    //       'endDate': vm.resident.endDate
    //     });
    //     vm.resident.residentName = '';
    //     vm.resident.tower = '';
    //     vm.resident.flatNo = '';
    //     vm.resident.floor = '';
    //     vm.resident.fromDate = '';
    //     vm.resident.endDate = '';
    //
    // }

    // vm.removeRow = function (residentName) {
    //   var index = -1;
    //   var comArr = eval(vm.helper.workingAt);
    //   for (var i = 0; i < comArr.length; i++) {
    //     if (comArr[i].residentName === residentName) {
    //       index = i;
    //       break;
    //     }
    //   }
    //   if (index === -1) {
    //     alert("Something gone wrong");
    //   }
    //   vm.helper.workingAt.splice(index, 1);
    // };

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

      for(var i=0; i<vm.helperTypeList.length; i++){
        if(vm.helperTypeList[i] == vm.helper.type){
          vm.helper.type = vm.typeList[i];
        }
      }

      if (vm.Form.$invalid) {
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        helperFactory.newHelper(vm.helper).then(function (response) {

          if (response.status == 200) {
            toaster.info('Helper Created');
            $state.go('app.helpers');
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error');
            console.error(response);
          }
          else if (response.status == 400) {
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

