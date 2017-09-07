
(function () {
  'use strict';

  angular
    .module('app.neighbours')
    .controller('NeighbourViewCtrl', NeighbourViewCtrl);

  NeighbourViewCtrl.$inject = [ 'NgTableParams', '$state', '$localStorage', '$filter', 'complaintFactory', 'SweetAlert', 'neighbourFactory', 'validationHelperFactory', '$stateParams' , 'toaster', 'role'];
  /* @ngInject */
  function NeighbourViewCtrl( NgTableParams, $state, $localStorage, $filter, complaintFactory, SweetAlert, neighbourFactory, validationHelperFactory, $stateParams , toaster, role) {
    var vm = this;
    //vm.searchByFlat = searchByFlat;
    vm.onSelect = onSelect;
    vm.searchFlat = searchFlat;
    vm.onSelectFlat = onSelectFlat;
    vm.clearFlat = clearFlat;
    vm.searchByName = searchByName;
    vm.message = false;
    //vm.progress = true;
    vm.breadcrumbRoute = breadcrumbRoute;
    vm.disableFlat = true;
    vm.nameData = false;
    vm.flatData = false;

    vm.neighbourMsg = $stateParams.msg;

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

    vm.hideComplaintBox = function () {
      vm.neighbourMsg = false;
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
    };

    vm.clearData = function () {
      vm.flatData = false;
    }

    vm.clearNameData = function () {
      vm.neighbourName = '';
      vm.nameData = '';
      vm.message = '';
      vm.errorMessage = '';
    }

    vm.disableFlatInput = function () {
      vm.flatData = false;
      vm.flatsearch = '';
      vm.message = '';
      vm.errorMessage = '';
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
    };

    function onSelect($item, $model, $label) {
      neighbourFactory.neighbourListByName(vm.neighbourName.name).then(function (response) {
        if(response.status == 200) {
          vm.master = response.data;
          vm.nameData = true;
          vm.flatData = false;
          neighbourData();
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });
    };

    vm.clearName = function() {
        vm.neighbourName = '';
        vm.message = '';
        vm.errorMessage = '';
    }

    function onSelectFlat($item, $model, $label) {
      vm.errorMessage = '';
      if (vm.flatList!=undefined && vm.flatList.length == 0) {
        vm.flatNoByTower = null;
      }
      else {
        if (vm.flatList!=undefined) {
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
      if (vm.flatNoByTower == undefined) {
        toaster.error('Flat not found');
        vm.errorMessage = 'Flat not found';
      }
      else{
        neighbourFactory.neighbourListByFlat(vm.tower, vm.flatNoByTower.flatNo).then(function (response) {
          if(response.status == 200) {
            vm.neighbour = response.data;
            vm.flatData = true;
            vm.nameData = false;
            vm.master = [];
            vm.master.push(vm.neighbour)
            console.log(vm.master)
            neighbourData();
          }
          else if (response.status == -1) {
            vm.progress = false;
            vm.errorMessage = 'Network Error';
            toaster.error('Network Error');
            console.error(response);
          }
          else if (response.status == 400) {
            vm.progress = false;
            vm.errorMessage = response.data.message;
            toaster.error(response.data.message);
            console.error(response);
          }
          else if (response.status == 404) {
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
            vm.errorMessage = 'Some problem';
            toaster.error('Some problem');
            console.error(response);
          }
        });
      }
    };

    function clearFlat() {
      vm.flatsearch = '';
      vm.flatData = false;
      vm.message = '';
      vm.errorMessage = '';
    }

    function searchByName(val) {
      vm.tower = '';
      vm.flatsearch = '';
      vm.flatData = '';
      vm.message = '';
      vm.errorMessage = '';
      return neighbourFactory.searchNeighboursByName(val).then(function (response) {
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
    };

    function searchFlat(val) {
        vm.errorMessage = '';
        vm.flatList = [];
        for(var index=0 ; index<vm.allFlatList.length;index++){
          if(val == vm.allFlatList[index].flatNo.slice(0,val.length)){
            vm.flatList.push(vm.allFlatList[index]);
          }
        }
        return vm.flatList;
      };

    function neighbourData() {
      vm.tableParams = new NgTableParams(
        {
          page: 1, // show first page
          count: 100, // count per page
          sorting: {
            lastModified: 'desc'   // initial sorting
          }, // count per page
          filter: {
            // complaintType: '',
            // status: ''// initial filter
          }
        }, {
          // total: data.length,

          getData: function (params) {
            vm.progress = false;

            if(vm.master != null && vm.master[0] != undefined) {
              vm.IsHidden = true;
            }
            else{
              vm.activeMessage = true;
              vm.neighbourMsg = "";
              vm.message="No data available";
              vm.flatData = '';
              vm.nameData = '';
            }

            if (vm.master != null) {
              var filteredData = null;
              var orderedData = null;
              if (params != null) {
                if (params.filter()) {
                  filteredData = $filter('filter')(vm.master, params.filter())
                }
                else {
                  filteredData = vm.master;
                }
                if (params.sorting()) {
                  orderedData = $filter('orderBy')(filteredData, params.orderBy());
                }
                else {
                  orderedData = filteredData;
                }
                params.total(orderedData.length);
                var returnData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())
                return returnData;
              }
              else {
                return vm.master;
              }

            }
          }
        });
    };
  }
})();
