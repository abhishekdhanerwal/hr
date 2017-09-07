
(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('HelperEditCtrl', HelperEditCtrl);

  HelperEditCtrl.$inject = [ 'NgTableParams', '$window', '$document', '$filter', 'helperFactory', '$state', 'validationHelperFactory', '$stateParams', 'toaster', 'role', '$scope', 'FileUploader', '$http', '$rootScope'];
  /* @ngInject */
  function HelperEditCtrl( NgTableParams, $window, $document, $filter, helperFactory, $state, validationHelperFactory, $stateParams , toaster, role, $scope, FileUploader, $http, $rootScope) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.submit = submit;
    vm.reset = reset;
    vm.helper = {};
    var attachmentCount = 0;

    function breadcrumbRoute() {
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

      helperFactory.findHelper($stateParams.id).then(function (response) {
        console.log($stateParams.id)
        if (response.status == 200) {
          vm.helper = response.data;
          attachmentCount = vm.helper.uploadedDocumentsUrl.length;
          for(var i=0; i<vm.typeList.length; i++){
            if(vm.typeList[i] == vm.helper.type){
              vm.helper.type = vm.helperTypeList[i];
            }
          }
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

      vm.helper.uploadedDocumentsUrl = [];

    };

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

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

    function reset() {
      activate($stateParams.id)
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    function submit() {
      var firstError = null;

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

        helperFactory.editHelper($stateParams.id, vm.helper).then(function (response) {
          console.log(response.data);

          if (response.status == 200) {
            toaster.info('Helper updated');
            vm.message = "Helper updated";
            $state.go('app.helpers',{msg: vm.message});
          }
          else if (response.status == -1) {
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.errorMessage = response.data.message;
            toaster.error(response.data.message);
            console.error(response);
          }
          else if (response.status == 401) {
            $state.go('auth.signout')
          }
          else {
            vm.errorMessage = 'Some problem';
            toaster.error('Some problem');
            console.error(response);
          }
          vm.resetDisabled = false;
          vm.submitDisabled = false;
        });
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
      for(var item = 0; item<tempLength ; item++){
        uploader.queue[0].remove();
      }
      var tempAttachmentLength = vm.helper.uploadedDocumentsUrl.length;
      if(vm.helper.uploadedDocumentsUrl.length > attachmentCount) {
        for(var index=attachmentCount ; index<tempAttachmentLength; index++){
          vm.helper.uploadedDocumentsUrl.splice(vm.helper.uploadedDocumentsUrl.length-1, 1);
        }
      }
    };

    vm.deleteFromList = function (item , temp) {
      if(temp == 'oldAttachment'){
        SweetAlert.swal({
          title: "Are you sure?",
          text: "You want to delete this attachment!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#4CAF50",
          confirmButtonText: "Yes",
          cancelButton: "#008CBA",
          cancelButtonText: "No",
          closeOnConfirm: true,
          closeOnCancel: true
        }, function (isConfirm) {
          if (isConfirm) {
            if (vm.helper.uploadedDocumentsUrl != undefined && vm.helper.uploadedDocumentsUrl[item] != undefined) {
              if (item > -1) {
                vm.helper.uploadedDocumentsUrl.splice(item, 1);
              }
            }
          } else {

          }
        });
      }
      else {
        if(vm.helper.uploadedDocumentsUrl != undefined && vm.helper.uploadedDocumentsUrl[item] != undefined && vm.helper.uploadedDocumentsUrl.length > attachmentCount) {
          if (item > -1) {
            vm.helper.uploadedDocumentsUrl.splice(attachmentCount + item, 1);
          }

        }
      }
    };

    vm.downloadAttachment = function (url) {
      $window.open(url);
    }

  }
})();

