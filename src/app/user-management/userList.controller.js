(function () {
  'use strict';
  angular
    .module('app.user')
    .controller('UserList', UserList);

  UserList.$inject = ['$filter', '$state', 'NgTableParams', 'toaster', 'userFactory', '$localStorage', 'SweetAlert', 'role']
  function UserList($filter, $state, NgTableParams, toaster, userFactory, $localStorage, SweetAlert, role) {
    var self = this;
    self.breadcrumbRoute = breadcrumbRoute;
    self.progress = true;

    function breadcrumbRoute() {
      if(self.isSuperAdminRole || self.isMeterManagementRole) {
        $state.go('app.complaint')
      }
      else if(self.isCreatorRole){
        $state.go('app.society')
      }
      else{
        $state.go('app.notice')
      }
    }

    activate();

    function activate() {

      if($localStorage._identity != null){
        self.disable = $localStorage._identity.principal.email;
      }

      self.isAdminRole = role.isAdminRole();
      self.isSuperAdminRole = role.isSuperAdminRole();
      self.isManagementRole = role.isManagementRole();
      self.isConsumerRole = role.isConsumerRole();
      self.isCreatorRole = role.isCreatorRole();
      self.isMeterManagementRole = role.isMeterManagementRole();
      self.isVisitorAdminRole = role.isVisitorAdminRole();

      userFactory.alluser().then(function (response) {
        self.progress = false;
        if (response.status == 200) {
          self.userList = response.data;
          console.log(self.userList)
          for (var i = 0; i < self.userList.length; i++) {

           // self.societyId = self.userList[i].societyId;

            // userFactory.findSociety(self.userList[i].societyId).then(function (response) {
            //   if(response.status == 200){
            //     for(var i=0; i<self.userList.length; i++){
            //       self.userList[i].societyName = '';
            //       if(self.userList[i].societyId == response.data.id){
            //         self.userList[i].societyName = response.data.name;
            //         console.log(self.userList[i].societyName)
            //       }
            //     }
            //   }
            // })

            // self.findSociety = function(){
            //   userFactory.societyList().then(function (response) {
            //     if(response.status == 200) {
            //       self.progress = false;
            //       self.society = response.data;
            //       for(var i=0; i<self.society.length; i++) {
            //         if(self.society[i].id == self.user.societyId){
            //           self.user.society = self.society[i];
            //         };
            //       }
            //     }
            //     else if( response.status == 401){
            //       $state.go('auth.signout')
            //     }
            //   });
            // }


            if (self.userList[i].role == "ROLE_CONSUMER") {
              self.userList[i].role = "CONSUMER";
              self.userId = self.userList[i].id;
            }
            else if (self.userList[i].role == "ROLE_ADMIN") {
              self.userList[i].role = "ADMIN"
            }
            else if (self.userList[i].role == "ROLE_SUPER_ADMIN") {
              self.userList[i].role = "SUPER ADMIN"
            }
            else if (self.userList[i].role == "ROLE_SOCIETY_CREATOR") {
              self.userList[i].role = "SOCIETY CREATOR"
            }
            else if (self.userList[i].role == "ROLE_METER_MANAGEMENT") {
              self.userList[i].role = "METER MANAGEMENT"
            }
            else if (self.userList[i].role == "ROLE_VISITOR_ADMIN") {
              self.userList[i].role = "VISITOR ADMIN"
            }
            else if (self.userList[i].role == "ROLE_PLUMBER") {
              self.userList[i].role = "PLUMBER"
            }
            else if (self.userList[i].role == "ROLE_MANAGEMENT") {
              self.userList[i].role = "MANAGEMENT"
            }
            else if (self.userList[i].role == "ROLE_CIVIC") {
              self.userList[i].role = "CIVIC"
            }
            else if (self.userList[i].role == "ROLE_CARPENTER") {
              self.userList[i].role = "CARPENTER"
            }
            else if (self.userList[i].role == "ROLE_ELECTRICIAN") {
              self.userList[i].role = "ELECTRICIAN"
            }
          }
          console.log(self.userList)
          findSociety();
          userAddress();
          listView();
        }
        else if (response.status == -1) {
          toaster.error('Network Error', 'error');
          self.errorMessage = "Network Error";
          console.error(response);
        }
        else if (response.status == 400) {
          console.error(response);
          self.errorMessage = self.userList[0].message;
          toaster.error(self.userList[0].message);
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
        else {
          toaster.error('Some problem', 'error');
          console.error(response);
        }
      })

    };

    function findSociety(){
      userFactory.societyList().then(function (response) {
        if(response.status == 200) {
          self.societyList = response.data;
          for(var i=0; i<self.societyList.length; i++) {
            for(var j=0; j<self.userList.length; j++){
              if(self.societyList[i].id == self.userList[j].societyId){
                self.userList[j].societyName = self.societyList[i].name;
                console.log(self.userList[j].societyName)
              };
            }
          }
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
      });
    }


    function userAddress() {
      console.log(self.userId)
      for(var i=0; i<self.userList.length; i++){
        if(self.userList[i].role == 'CONSUMER') {
          addAddress(self.userList[i].id, i);
        }
      }
    }

    function addAddress(id, index) {
      userFactory.userAddress(id).then(function(response){
        if(response.status == 200){
          self.userList[index].address = 'Tower:' + response.data.tower + ',Flat No:' + response.data.flatNo;
        }
        else if(response.status == 401){
          $state.go('auth.signout')
        }
      })
    }

    function listView(){
      self.tableParams = new NgTableParams(
        {
          page: 1, // show first page
          count: 10, // count per page
          sorting: {
            lastModified: 'desc' // initial sorting
          }, // count per page
          filter: {
            name: '',
            role: ''// initial filter
          }
        }, {
          getData: function (params) {
            self.progress = false;

            if(self.userList != null && self.userList[0] != undefined){
              self.IsHidden=true;
            }
            else{
              self.message="No data available";
            }

            if (self.userList != null) {
              console.log(self.userList)

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
      self.progress = false;
      userFactory.changeStatus(id).then(function (response) {
        if (response.status == 200) {
          toaster.info('Status Changed Successfully');
        }
        else if (response.status == -1) {
          toaster.error('Network Error');
        }
        else if (response.status == 404) {
          toaster.error('User not found');
        }
        else if( response.status == 401){
          $state.go('auth.signout')
        }
        else {
          toaster.error('Backend error');
        }
        $state.reload();
      });
    };
    self.toggleStatus = function (id) {
      self.progress = false;
      console.log(id)
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
              toaster.info('Status Changed Successfully');
            }
            else if (response.status == -1) {
              self.progress = false;
              toaster.error('Network Error');
            }
            else if( response.status == 401){
              $state.go('auth.signout')
            }
            else if (response.status == 404) {
              self.progress = false;
              toaster.error('Client not found');
            }
            else {
              self.progress = false;
              toaster.error(response.data[0].message);
              self.errorMessage = response.data[0].message;
            }

          });
        } else {
        }
      });

    };
  }
})();
