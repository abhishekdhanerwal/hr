(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .factory('authorization', authorization);

  authorization.$inject = ['$rootScope', '$state', 'principal', 'toaster', '$localStorage'];

  /* @ngInject */
  function authorization($rootScope, $state, principal, toaster , $localStorage) {
    var service = {
      authorize: authorize
    };
    return service;

    ////////////////

    function authorize() {
      console.log('authorize');
      console.log($localStorage._identity.principal.role)
      if(_.includes($state.current.data.roles, $localStorage._identity.principal.role)){
           return true;
      }
      else{
        $state.go('app.notice')
      }
      // return principal.identity()
      //   .then(identityResolved, identityResolvedFailure);
    }

    function identityResolved() {
      var isAuthenticated = principal.isAuthenticated();

      if (isAuthenticated) {
        if ($rootScope.toState.data) {
          if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0) {
            if (principal.isInAnyRole($rootScope.toState.data.roles)) {
              //all well
            }
            else {
              //user is not authorized
              $state.go('error.403');
            }
          }
          else {
            //no role data defined on state. It means user is allowed here
          }
        }
        else {
          //no role data defined on state. It means user is allowed here
        }
      }
      else {
        // user is not authenticated. stow the state they wanted before you
        // send them to the signin state, so you can return them when you're done
        routeToSignin();
      }
    }

    function identityResolvedFailure() {
      toaster.info("User is not logged in. Redirecting to Login Page");
      routeToSignin();
    }

    function routeToSignin() {
      $rootScope.returnToState = $rootScope.toState;
      $rootScope.returnToStateParams = $rootScope.toStateParams;
      $state.go('auth.view');
    }
  }

})();


