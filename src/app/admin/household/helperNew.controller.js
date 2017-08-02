
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
    vm.showTable = false;
    vm.addHelper = addHelper;
    vm.submit = submit;
    vm.reset = reset;
    vm.houseHelper = [];
    vm.helper = {};
    vm.helper.policeVerificationDone = false;
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

      helperFactory.helperList().then(function (response) {

        vm.progress = false;

        if (response.status == 200) {
          vm.householdHelper = response.data;
          for(var i=0; i<vm.householdHelper.length; i++){
            if(vm.householdHelper[i].type == 'Car_Cleaner'){
              vm.householdHelper[i].type = 'Car Cleaner';
            }
          }
          for (var flag=0 ; flag<vm.householdHelper.length ; flag++){
            for(var index=0 ; index<vm.householdHelper[flag].workingAt.length ; index++){
              if($localStorage._identity != undefined){
                if(vm.householdHelper[flag].workingAt[index].user.id == $localStorage._identity.principal.id){
                  vm.householdHelper[flag].startDate = angular.copy(vm.householdHelper[flag].workingAt[index].helperMap[vm.householdHelper[flag].helperNo][0]);
                  vm.householdHelper[flag].endDate = angular.copy(vm.householdHelper[flag].workingAt[index].helperMap[vm.householdHelper[flag].helperNo][1]);
                  console.log(vm.householdHelper[flag].endDate)
                }
              }
            }
          }
          console.log(vm.householdHelper)
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
        else if (response.status == 401) {
          $state.go('auth.signout')
        }
        else {
          toaster.error('Some problem', 'error');
          console.error(response);
        }
      })

      // vm.endDateValidation = function () {
      //   vm.endMinDate = vm.resident.fromDate;
      // }
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

    vm.removeImage = function () {
      vm.helper = {};
      console.log(vm.helper.profilePictureUrl)
      vm.noImage = true;
      vm.helper.profilePictureUrl = null;
    };


      function addHelper() {
        if(vm.householdHelper != undefined){
          for(var i=0; i<vm.householdHelper.length; i++){
            console.log(vm.householdHelper[i].endDate)
            if(vm.helper.number == vm.householdHelper[i].helperNo){
              vm.houseHelper.push({
                'name': vm.householdHelper[i].name,
                'mobile': vm.householdHelper[i].mobile,
                'type': vm.householdHelper[i].type,
                'gender': vm.householdHelper[i].gender,
                'policeVerificationDone': vm.householdHelper[i].policeVerificationDone,
                'endDate': vm.householdHelper[i].endDate
              });
            }
            // vm.householdHelper.name = '';
            // vm.householdHelper.mobile = '';
            // vm.householdHelper.type = '';
            // vm.householdHelper.gender = '';
            // vm.householdHelper.policeVerification = '';
          }
        }
    }


    vm.removeRow = function (name) {
      helperFactory.removeHelper(vm.helper.number).then(function (response) {

        if (response.status == 200) {
          toaster.info('Helper Removed');
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
      var index = -1;
      var comArr = eval(vm.houseHelper);
      for (var i = 0; i < comArr.length; i++) {
        if (comArr[i].name === name) {
          index = i;
          break;
        }
      }
      if(index == 0){
        vm.showTable = false;
      }
      if (index === -1) {
        alert("Something gone wrong");
      }
      vm.houseHelper.splice(index, 1);
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

        if(vm.isConsumerRole){
          helperFactory.addHelperForConsumer(vm.helper.number).then(function (response) {

            if (response.status == 200) {
              toaster.info('Helper Created');
              vm.showTable = true;
              vm.addHelper();
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
        else{
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

      }
    };
  }
})();

