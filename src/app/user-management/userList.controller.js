(function () {
  'use strict';
  angular
    .module('app.user')
    .controller('UserList', UserList);

  UserList.$inject = ['$filter', '$state', 'NgTableParams', 'logger', 'userFactory', 'role', 'ACCESS_LEVEL', '$localStorage', 'SweetAlert']
  function UserList($filter, $state, NgTableParams, logger, userFactory, role, ACCESS_LEVEL, $localStorage, SweetAlert) {
    var self = this;
    self.progress = true;
    self.breadcrumbRoute = breadcrumbRoute;

    function breadcrumbRoute() {
      if($localStorage._identity.sites.length == 1){
        var siteId = $localStorage._identity.sites[0].id;
        $state.go('app.dashboard' ,({id : siteId}));
      }
      else{
        $state.go('app.dashboardAll');
      }
    }

    activate();

    function activate() {

      self.disableActive = $localStorage._identity.userDetails.email;
      self.isUserCreationAllowed = role.isAdminRole();
      self.isUserEditAllowed = role.isAdminRole();
      self.isActiveAllowed = role.isAdminRole();

      userFactory.getAll().then(function (response) {
        self.userList = response.data;
        listView();
      })
    };

    function listView(){
      self.tableParams = new NgTableParams(
        {
          page: 1, // show first page
          count: 10, // count per page
          sorting: {
            lastModified: 'desc' // initial sorting
          }, // count per page
          filter: {
            firstname: '' // initial filter
          }
        }, {
          getData: function (params) {
            self.progress = false;
            if (self.userList != null) {

              var filteredData = null;
              var orderedData = null;
              if (params != null) {
                if (params.filter()) {
                  filteredData = $filter('filter')(self.userList, params.filter())
                }
                else {
                  filteredData = self.userList;
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
                return self.userList;
              }
            }
          }
        })
    }

    self.toggleStatus = function (id) {
      userFactory.changeStatus(id).then(function (response) {
        if (response.status == 200) {
          logger.info('Status Changed Successfully');
        }
        else if (response.status == -1) {
          logger.error('Network Error');
        }
        else if (response.status == 404) {
          logger.error('User not found');
        }
        else {
          logger.error('Backend error');
        }
        $state.reload();
      });
    };
    self.toggleStatus = function (id) {
      SweetAlert.swal({
        title: "Are you sure?",
        text: "You want to change the status!",
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
          self.progress = true;
          userFactory.changeStatus(id).then(function (response) {
            if (response.status == 200) {
              self.progress = false;
              $state.reload();
              logger.info('Status Changed Successfully');
            }
            else if (response.status == -1) {
              self.progress = false;
              logger.error('Network Error');
            }
            else if (response.status == 404) {
              self.progress = false;
              logger.error('Client not found');
            }
            else {
              self.progress = false;
              logger.error(response.data.error_description);
            }


          });
        } else {
        }
      });

    };
  }
})();