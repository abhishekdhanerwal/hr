(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .factory('role', role);

  role.$inject = ['$localStorage', 'USER_ROLE'];

  /* @ngInject */

    function role($localStorage, USER_ROLE) {
     // console.log($localStorage._identity)
      var service = {
        isAdminRole: isAdminRole,
        isSuperAdminRole: isSuperAdminRole,
        isManagementRole: isManagementRole,
        isConsumerRole : isConsumerRole,
        isCreatorRole : isCreatorRole,
        currentAccessLevel : currentAccessLevel,
        // getMainRole : getMainRole
      };
      return service;


    ////////////////

    function isSuperAdminRole() {
      if($localStorage._identity) {
        var roles = $localStorage._identity.principal.role;
        var index = _.findIndex(roles, function(o) {
          index = 0 ;
          if (roles.match(/SUPER_ADMIN/g)){
            index++;
          }
          return index
        });
        return index >= 0;
      }
    }

    function isAdminRole() {
      if($localStorage._identity) {
        var roles = $localStorage._identity.principal.role;
        var index = _.findIndex(roles, function(o) {
          index = 0 ;
          if (roles.match(/ROLE_ADMIN/g)){
            index++;
          }
          return index
        });
        return index >= 0;
      }
    }

    function isManagementRole() {
      if($localStorage._identity) {
        var roles = $localStorage._identity.principal.role;
        var index = _.findIndex(roles, function(o) {
          index = 0 ;
          if (roles.match(/MANAGEMENT/g)){
            index++;
          }
          return index
        });
        return index >= 0;
      }
    }

    function isConsumerRole() {
      if($localStorage._identity) {
        var roles = $localStorage._identity.principal.role;
        var index = _.findIndex(roles, function(o) {
          index = 0 ;
          if (roles.match(/CONSUMER/g)){
            index++;
          }
          return index
        });
        return index >= 0;
      }
    }

    function isCreatorRole() {
        if($localStorage._identity) {
          var roles = $localStorage._identity.principal.role;
          var index = _.findIndex(roles, function(o) {
            index = 0 ;
            if (roles.match(/CREATOR/g)){
              index++;
            }
            return index
          });
          return index >= 0;
        }
    }

    function currentAccessLevel() {
      if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
          'use strict';
          if (typeof start !== 'number') {
            start = 0;
          }

          if (start + search.length > this.length) {
            return false;
          } else {
            return this.indexOf(search, start) !== -1;
          }
        };
      }
      var roles = $localStorage._identity.principal.role;
      var index = _.findIndex(roles, function(o) {
        index = 0 ;
        if (roles.match(/ADMIN/g)){
          index++;
        }
        return index
      });
      if(index >= 0) return USER_ROLE.SUPER_ADMIN;
      var index = _.findIndex(roles, function(o) {
        index = 0 ;
        if (roles.match(/CONSUMER/g)){
          index++;
        }
        return index
      });
      if(index >= 0) return USER_ROLE.CONSUMER;
       var index = _.findIndex(roles, function(o) {
        index = 0 ;
        if (roles.match(/MANAGEMENT/g)){
          index++;
        }
        return index
      });
      if(index >= 0) return USER_ROLE.MANAGEMENT;
      else return 0;
    }

    // function getMainRole() {
    //   var mainRole = null;
    //   if (!String.prototype.includes) {
    //     String.prototype.includes = function(search, start) {
    //       'use strict';
    //       if (typeof start !== 'number') {
    //         start = 0;
    //       }
    //
    //       if (start + search.length > this.length) {
    //         return false;
    //       } else {
    //         return this.indexOf(search, start) !== -1;
    //       }
    //     };
    //   }
    //   if($localStorage._identity) {
    //     var roles = $localStorage._identity.principal.role;
    //     if(isAdminRole()) {
    //       mainRole = 'Site Admin';
    //       var indexRegion = _.findIndex(roles, function(o) { return o.role.name.includes('REGION')});
    //       if(indexRegion >= 0) mainRole = 'Region Admin';
    //       var indexClient = _.findIndex(roles, function(o) { return o.role.name.includes('CLIENT')});
    //       if(indexClient >= 0) mainRole = 'Client Admin';
    //       var indexSuperAdmin = _.findIndex(roles, function(o) { return o.role.name.includes('SUPER')});
    //       if(indexSuperAdmin >= 0) mainRole = 'Super Admin';
    //     }
    //     else {
    //       mainRole = 'Site Viewer';
    //       var indexRegion = _.findIndex(roles, function(o) { return o.role.name.includes('REGION')});
    //       if(indexRegion >= 0) mainRole = 'Region Viewer';
    //       var indexClient = _.findIndex(roles, function(o) { return o.role.name.includes('CLIENT')});
    //       if(indexClient >= 0) mainRole = 'Client Viewer';
    //     }
    //
    //     return mainRole;
    //   }
    //
    // }
  }

})();


