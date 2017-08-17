
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('HelperNewCtrl', HelperNewCtrl);

  HelperNewCtrl.$inject = [ '$http', '$rootScope', 'NgTableParams', 'flowFactory', 'helperFactory', '$localStorage', 'role', '$filter', '$document', '$state', 'validationHelperFactory', 'toaster', '$scope', 'FileUploader','$cookies'];
  /* @ngInject */
  function HelperNewCtrl( $http, $rootScope, NgTableParams, flowFactory, helperFactory, $localStorage, role, $filter, $document, $state, validationHelperFactory , toaster, $scope, FileUploader, $cookies) {
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
      if(vm.isMeterManagementRole) {
        $state.go('app.complaint')
      }
      else if(vm.isCreatorRole || vm.isSuperAdminRole){
        $state.go('app.society')
      }
      else if(vm.isVisitorAdminRole){
        $state.go('app.visitor')
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
      vm.isVisitorAdminRole = role.isVisitorAdminRole();

      vm.maxDate = new Date();
      console.log(vm.maxDate)

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
            // if(vm.householdHelper[i].type == 'Car_Cleaner'){
            //   vm.householdHelper[i].type = 'Car Cleaner';
            // }
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

      vm.helper.uploadedDocumentsUrl = [];

      // vm.endDateValidation = function () {
      //   vm.endMinDate = vm.resident.fromDate;
      // }
    }

    vm.saveImage = function () {
      vm.imageProgress = true;
      var formData = new FormData();
      formData.append('file', vm.obj.flow.files[0].file);
      $http.post(__env.dataServerUrl + "/fileUpload/helperImageUpload", formData, {
        data: formData,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        },
        transformResponse: [function (data, headers) {
          return data;
        }]
      }).success(function (response) {
        console.log(response)
        vm.imageProgress = false;
        vm.helper.profilePicUrl = response;
        $rootScope.$broadcast('refreshImage' , vm.helper.profilePicUrl);
        toaster.success("File uploaded successfully");

      }).error(function (response) {
        vm.errorMessage = "File upload error";
        console.log(response)
        toaster.error("File upload error");
      });
    };

    vm.removeImage = function () {
      //vm.helper = {};
      console.log(vm.helper.profilePicUrl)
      vm.noImage = true;
      vm.helper.profilePicUrl = null;
    };


      function addHelper() {
        if(vm.householdHelper != undefined){
          for(var i=0; i<vm.householdHelper.length; i++){
            console.log(vm.householdHelper[i].endDate)
            if(vm.helper.number == vm.householdHelper[i].helperNo){
              vm.houseHelper.push({
                'name': vm.householdHelper[i].name,
                'aadharId': vm.householdHelper[i].aadharId,
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
        vm.progress = true;
      helperFactory.removeHelper(vm.helper.number).then(function (response) {

        if (response.status == 200) {
          toaster.info('Helper Removed');
          vm.progress = false;
        }
        else if (response.status == -1) {
          vm.errorMessage = 'Network Error';
          toaster.error('Network Error');
          console.error(response);
          vm.progress = false;
        }
        else if (response.status == 400) {
          vm.errorMessage = response.data[0].message;
          toaster.error(response.data[0].message);
          console.error( vm.errorMessage);
          vm.progress = false;
        }
        else if( response.status == 401){
          $state.go('auth.signout')
          vm.progress = false;
        }
        else {
          vm.errorMessage = 'Some problem';
          toaster.error('Some problem');
          console.error(response);
          vm.progress = false;
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
      vm.errorMessage = '';
      vm.progress = true;
      var firstError = null;
      console.log(vm.helper)

      for(var i=0; i<vm.helperTypeList.length; i++){
        if(vm.helperTypeList[i] == vm.helper.type){
          vm.helper.type = vm.typeList[i];
        }
      }

      if (vm.Form.$invalid) {
        vm.progress = false;
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        if(vm.isConsumerRole){
          helperFactory.addHelperForConsumer(vm.helper.number).then(function (response) {

            if (response.status == 200) {
              toaster.info('Helper Added');
              vm.showTable = true;
              vm.addHelper();
              vm.progress = false;
            }
            else if (response.status == -1) {
              vm.errorMessage = 'Network Error';
              toaster.error('Network Error');
              console.error(response);
              vm.progress = false;

            }
            else if (response.status == 400) {
              vm.errorMessage = response.data[0].message;
              toaster.error(response.data[0].message);
              console.error( vm.errorMessage);
              vm.progress = false;
            }
            else if( response.status == 401){
              $state.go('auth.signout')
              vm.progress = false;
            }
            else {
              vm.errorMessage = 'Some problem';
              toaster.error('Some problem');
              console.error(response);
              vm.progress = false;
            }
          });
        }
        else{
          helperFactory.newHelper(vm.helper).then(function (response) {

            if (response.status == 200) {
              toaster.info('Helper Created');
              vm.message = "Helper Created";
              $state.go('app.helpers', {msg: vm.message});
              vm.progress = false;
            }
            else if (response.status == -1) {
              vm.errorMessage = 'Network Error';
              toaster.error('Network Error');
              console.error(response);
              vm.progress = false;
            }
            else if (response.status == 400) {
              vm.errorMessage = response.data[0].message;
              toaster.error(response.data[0].message);
              console.error( vm.errorMessage);
              vm.progress = false;
            }
            else if( response.status == 401){
              $state.go('auth.signout')
              vm.progress = false;
            }
            else {
              vm.errorMessage = 'Some problem';
              toaster.error('Some problem');
              console.error(response);
              vm.progress = false;
            }
          });
        }

      }
    };

    var uploader = $scope.uploader = new FileUploader({
      url: __env.dataServerUrl + '/fileUpload/userImageUpload'
    });

    // FILTERS

    uploader.filters.push({
      name: 'customFilter',
      fn: function (item/*{File|FileLikeObject}*/, options) {
        return this.queue.length < 10;
      }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item/*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
      console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
      console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
      console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
      vm.helper.uploadedDocumentsUrl.push(response);
      console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
      vm.disableButton = false;
      toaster.error('Attachment Not Saved');
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
      vm.disableButton = false;
      toaster.info('Attachment Saved');
      console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function () {
      vm.disableButton = false;
      console.info('onCompleteAll');
    };

    uploader.cancelAll = function(){
      for(var item = 0; item<uploader.queue.length ; item++){
        uploader.queue[item].remove();
      }
      vm.helper.uploadedDocumentsUrl = [];
    };

    uploader.clearQueue = function(){
      var tempLength = uploader.queue.length;
      vm.helper.uploadedDocumentsUrl = [];
      for(var item = 0; item<tempLength ; item++){
        uploader.queue[0].remove();
      }
    };

    vm.deleteFromList = function (item , temp) {
      if(vm.helper.uploadedDocumentsUrl != undefined && vm.helper.uploadedDocumentsUrl[item] != undefined){
        if (item > -1) {
          vm.helper.uploadedDocumentsUrl.splice(item, 1);
        }
      }
    };

  }
})();

