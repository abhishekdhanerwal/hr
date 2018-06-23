(function () {
    'use strict';
  
    angular
      .module('blocks.auth')
      .controller('CompanyMiscController', CompanyMiscController);
  
      CompanyMiscController.$inject = ['$scope', '$state', 'ngNotify', '$filter', '$localStorage', 'validationHelperFactory'];
    /* @ngInject */
    function CompanyMiscController($scope, $state, ngNotify, $filter, $localStorage, validationHelperFactory) {
      var vm = this;
  
      
      activate();
  
      function activate() {
      }

    }
  })();
