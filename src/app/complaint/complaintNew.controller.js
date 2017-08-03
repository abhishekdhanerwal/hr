
(function () {
  'use strict';

  angular
    .module('app.complaint')
    .controller('ComplaintNewCtrl', ComplaintNewCtrl);

  ComplaintNewCtrl.$inject = [ 'NgTableParams', '$filter', '$document', 'role', 'complaintFactory', '$state', 'validationHelperFactory', 'toaster', '$localStorage'];
  /* @ngInject */
  function ComplaintNewCtrl( NgTableParams, $filter, $document, role, complaintFactory, $state, validationHelperFactory , toaster, $localStorage) {
    var vm = this;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.searchFlat = searchFlat;
    vm.onSelect = onSelect;
    vm.clearFlat = clearFlat;
    vm.submit = submit;
    vm.reset = reset;
    vm.disableFlat = true;

    function breadcrumbRoute() {
      if (vm.isSuperAdminRole || vm.isMeterManagementRole) {
        $state.go('app.complaint')
      }
      else if (vm.isCreatorRole) {
        $state.go('app.society')
      }
      else {
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

      complaintFactory.getTowerList($localStorage._identity.principal.societyId).then(function (response) {
        vm.towerList = response.data;
      })

      complaintFactory.flatList().then(function (response) {
        if (response.status == 200) {
          vm.flat = response.data;
        }
        else if (response.status == 401) {
          $state.go('auth.signout')
        }
      })

      complaintFactory.loadTypeDetails().then(function (response) {
        if (response.status == 200) {
          vm.complaintType = response.data;
        }
        else if (response.status == 401) {
          $state.go('auth.signout')
        }
      })
    };

    vm.disableFlatInput = function () {
      complaintFactory.findAllFlats(vm.tower).then(function (response) {
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


    vm.populateAssignToList = function () {
      complaintFactory.userByComplaintType(vm.complaint.complaintType).then(function (response) {
        if (response.status == 200) {
          vm.assignTo = response.data;
          if (vm.complaint.complaintType == 'Meter') {
            vm.complaint.assignedTo = vm.assignTo[0];
          }
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

      // return complaintFactory.searchFlat(val, vm.tower).then(function (response) {
      //   vm.searchFlatList = response.data;
      //   if (response.status == 200) {
      //     console.log(response.data)
      //     var params = {
      //       query: val
      //     };
      //     return response.data.map(function (item) {
      //       return item;
      //     })
      //   }
      //   else if (response.status == 401) {
      //     $state.go('auth.signout')
      //   }
      // });
    }

    function onSelect($item, $model, $label) {
      vm.complaint.address.tower = $item.tower;
      vm.complaint.address.flat = $item.flat;
    };

    function clearFlat() {
      vm.flatsearch = '';
    }

    function reset() {
      vm.tower = '';
      vm.complaint = '';
      vm.flatsearch = '';
      vm.Form.$setPristine();
      vm.Form.$setUntouched();
    }

    vm.toTheTop = function () {
      $document.scrollTopAnimated(0, 400);
    };

    function submit() {
      if (!vm.isConsumerRole && vm.flatList.length == 0) {
        vm.flatNoByTower = null;
      }
      else {
        if (!vm.isConsumerRole) {
          for (var i = 0; i < vm.flatList.length; i++) {
            if (vm.flatList[i].flatNo == vm.flatsearch || vm.flatList[i].flatNo == vm.flatsearch.flatNo) {
              vm.flatNoByTower = vm.flatList[i];
            }
            else {
              vm.flatNoByTower = null;
            }
          }
        }
      }
      if (!vm.isConsumerRole && vm.flatNoByTower == undefined) {
        toaster.error('Flat not found');
        vm.errorMessage = 'Flat not found';
      }
      else {
        vm.progress = true;

        var firstError = null;

        if (vm.Form.$invalid) {
          vm.progress = false;
          validationHelperFactory.manageValidationFailed(vm.Form);
          vm.errorMessage = 'Validation Error';
          return;

        } else {

          //vm.flatsearch = vm.complaint.registerFor;
          vm.complaint.registerFor = vm.flatNoByTower;

          complaintFactory.newComplaint(vm.complaint).then(function (response) {
            console.log(response.data);

            if (response.status == 200) {
              vm.progress = false;
              toaster.info('Complaint registered');
              vm.message = "Complaint registered";
              $state.go('app.complaint', {msg: vm.message});
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
    };
  }
})();

