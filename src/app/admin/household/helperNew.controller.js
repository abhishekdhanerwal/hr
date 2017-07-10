
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
    vm.flatList = flatList;
    vm.onSelect = onSelect;
    vm.submit = submit;
    vm.reset = reset;
    vm.addResident = addResident;
    vm.helper = [];
    vm.helper.workingAt = [];
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

      helperFactory.helperType().then(function (response) {
        if (response.status == 200) {
          vm.helperTypeList = response.data;
        }
        else if (response.status == 401) {
          $state.go('auth.signout')
        }
      });

      vm.endDateValidation = function () {
        vm.endMinDate = vm.helpers.fromDate;
      }
    }

    function flatList(val){
      return helperFactory.searchFlatno(val).then(function (response) {
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
      vm.helpers.residentName = $item.residentName;
      vm.helpers.tower = $item.tower;
      vm.helpers.flatNo = $item.flatNo;
      vm.helpers.floor = $item.floor;
      vm.helpers.fromDate = $item.fromDate;
      vm.helpers.endDate = $item.endDate;
    };

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
      vm.helper.workingAt.push({
        'residentName': vm.helpers.residentName,
        'tower': vm.helpers.tower,
        'flatNo': vm.helpers.flatNo,
        'floor': vm.helpers.floor,
        'fromDate': vm.helpers.fromDate,
        'endDate' : vm.helpers.endDate
      });
      vm.helpers.residentName = '';
      vm.helpers.tower = '';
      vm.helpers.flatNo = '';
      vm.helpers.floor = '';
      vm.helpers.fromDate = '';
      vm.helpers.endDate = '';
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

      if (vm.Form.$invalid) {
        validationHelperFactory.manageValidationFailed(vm.Form);
        vm.errorMessage = 'Validation Error';
        return;

      } else {

        helperFactory.newHelper(vm.helper).then(function (response) {

          if (response.status == 200) {
            toaster.info('Helper Created');
            $state.go('app.createHelper');
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

