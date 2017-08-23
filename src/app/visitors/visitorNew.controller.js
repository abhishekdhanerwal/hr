
(function () {
  'use strict';

  angular
    .module('app.visitors')
    .controller('VisitorNewCtrl', VisitorNewCtrl);

  VisitorNewCtrl.$inject = [ 'NgTableParams', '$filter', '$document', 'role', 'visitorFactory', '$state', 'validationHelperFactory', 'toaster', '$localStorage'];
  /* @ngInject */
  function VisitorNewCtrl( NgTableParams, $filter, $document, role, visitorFactory, $state, validationHelperFactory , toaster, $localStorage) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.submit = submit;
    vm.reset = reset;
    vm.searchFlat = searchFlat;
    vm.onSelect = onSelect;
    vm.clearFlat = clearFlat;
    vm.disableFlat = true;
    vm.showCheckbox = false;

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

      vm.hstep = 1;
      vm.mstep = 1;
      vm.ismeridian = false;

      visitorFactory.getTowerList($localStorage._identity.principal.societyId).then(function (response) {
        vm.towerList = response.data;
      });

      visitorFactory.getVisitorType().then(function (response) {
        if(response.status == 200){
          vm.visitorType = response.data;
          vm.visitorTypeList = [];
          for(var index=0; index<vm.visitorType.length; index++){
            var temp = vm.visitorType[index].split("_");
            if(temp.length > 1){
              console.log(temp)
              var newTemp = "";
              for(var j=0 ; j<temp.length ; j++){
                newTemp = newTemp + temp[j] + " ";
              }
              vm.visitorTypeList.push(newTemp);
            }
            else
              vm.visitorTypeList.push(vm.visitorType[index]);
          }
        }
        else if (response.status == -1) {
          vm.progress = false;
          vm.errorMessage = 'Network Error';
          toaster.error('Network Error', 'error');
          console.error(response);
        }
        else if (response.status == 400) {
          vm.progress = false;
          vm.errorMessage = response.data[0].message;
          toaster.error(response.data[0].message);
          console.error(response);
        }
        else if (response.status == 401) {
          vm.progress = false;
          $state.go('auth.signout')
        }
        else {
          vm.progress = false;
          vm.errorMessage = 'Some problem';
          toaster.error('Some problem', 'error');
          console.error(response);
        }
      })

    };

    vm.disableFlatInput = function () {
      vm.flatsearch = "";
      visitorFactory.findAllFlats(vm.tower).then(function (response) {
        if (response.status == 200) {
          vm.allFlatList = response.data;
          console.log(vm.allFlatList);
          vm.disableFlat = false;
        }
        else if (response.status == 401) {
          $state.go('auth.signout')
        }
      });
    }

    function searchFlat(val) {
      vm.flatList = [];
      for(var index=0 ; index<vm.allFlatList.length;index++){
        if(val == vm.allFlatList[index].flatNo.slice(0,val.length)){
          vm.flatList.push(vm.allFlatList[index]);
        }
      }
      return vm.flatList;
    }

    function onSelect($item, $model, $label) {
      vm.visitor.tower = $item.tower;
      vm.visitor.flat = $item.flat;
    };

    function clearFlat() {
      vm.flatsearch = '';
    }

    function reset() {
      vm.visitor = '';
      vm.mobilesearch = '';
      vm.tower = '';
      vm.flatsearch = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    vm.searchVisitor = function () {
      visitorFactory.searchVisitor(vm.mobilesearch).then(function (response) {
        if (response.status == 200) {
          vm.errorMessage = '';
          vm.showCheckbox = true;
          vm.visitor = response.data;
          vm.mobilesearch = vm.visitor.mobile;
          vm.tower = vm.visitor.tower;
          vm.flatsearch = vm.visitor.flatNo;
          for(var i=0; i<vm.visitorType.length; i++){
            if(vm.visitorType[i] == vm.visitor.type){
              vm.visitor.type = vm.visitorTypeList[i];
            }
          }
          // vm.disableFlatInput();
          // vm.searchFlat(vm.flatsearch);
          console.log(vm.visitor);
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
        else if (response.status == 401) {
          $state.go('auth.signout')
        }
        else {
          vm.errorMessage = 'Some problem';
          toaster.error('Some problem', 'error');
          console.error(response);
        }
      });
    }


    function submit() {

      vm.progress = true;
      var firstError = null;

      if(vm.visitor != undefined){
        for(var index=0 ; index < vm.visitorTypeList.length ; index++){
          if(vm.visitorTypeList[index] == vm.visitor.type)
            vm.visitor.type = vm.visitorType[index];
        }
      }
      if (vm.Form.$invalid) {
          vm.progress = false;
          validationHelperFactory.manageValidationFailed(vm.Form);
          vm.errorMessage = 'Validation Error';
          return;

        } else {

          if(vm.flatList != undefined){
            if (!vm.isConsumerRole && vm.flatList.length == 0) {
              vm.flatNoByTower = null;
            }
            else {
              if (!vm.isConsumerRole) {
                for (var i = 0; i < vm.flatList.length; i++) {
                  if (vm.flatList[i].flatNo == vm.flatsearch || vm.flatList[i].flatNo == vm.flatsearch.flatNo) {
                    vm.flatNoByTower = vm.flatList[i];
                    break;
                  }
                  else {
                    vm.flatNoByTower = null;
                  }
                }
              }
            }
          }
          if (!vm.isConsumerRole && vm.flatList!=undefined && vm.flatNoByTower == undefined) {
            vm.progress = false;
            toaster.error('Flat not found');
            vm.errorMessage = 'Flat not found';
          }
          else {

            if(vm.flatNoByTower != undefined){
              vm.visitor.tower = vm.flatNoByTower.tower;
              vm.visitor.flatNo = vm.flatNoByTower.flatNo;
            }
            vm.sendData = {};
            if($localStorage._identity.principal.role == 'ROLE_VISITOR_ADMIN'){
              vm.sendData = vm.visitor;
            }
            else {
              vm.sendData.name = vm.visitor.name;
              vm.sendData.mobile = vm.visitor.mobile;
              vm.sendData.vehicleNo = vm.visitor.vehicleNo;
              vm.sendData.comingFrom = vm.visitor.comingFrom;
              var currentTime = new Date();
              var expectedArrivalTime = new Date(vm.visitor.expectedArrivalTime);
              vm.sendData.expectedArrivalTime = new Date(currentTime.getFullYear(),currentTime.getMonth(), currentTime.getDate() , expectedArrivalTime.getHours(), expectedArrivalTime.getMinutes());
              vm.sendData.type = vm.visitor.type;
              vm.sendData.purposeOfVisit = vm.visitor.purposeOfVisit;
              vm.sendData.tower = vm.visitor.tower;
              vm.sendData.flatNo = vm.visitor.flatNo;
            }
            visitorFactory.addVisitor(vm.sendData).then(function (response) {
              console.log(response.data);

              if (response.status == 200) {
                vm.progress = false;
                toaster.info('Visitor created');
                vm.message = "Visitor created";
                $state.go('app.visitor', {msg: vm.message});
              }
              else if (response.status == -1) {
                vm.progress = false;
                vm.errorMessage = 'Network Error';
                toaster.error('Network Error', 'error');
                console.error(response);
              }
              else if (response.status == 400) {
                vm.progress = false;
                vm.errorMessage = response.data[0].message;
                toaster.error(response.data[0].message);
                console.error(response);
              }
              else if (response.status == 401) {
                vm.progress = false;
                $state.go('auth.signout')
              }
              else {
                vm.progress = false;
                vm.errorMessage = 'Some problem';
                toaster.error('Some problem', 'error');
                console.error(response);
              }
              vm.resetDisabled = false;
              vm.submitDisabled = false;
            });
          }
        }
      }
    };
})();

