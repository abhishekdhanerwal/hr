(function () {
  'use strict';

  angular
    .module('blocks.auth')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'auth',
        config: {
          abstract: true,
          url: '/auth',
          template: '<div ui-view class="fade-in-right-big smooth"></div>'
        }
      },
      {
        state: 'auth.signin',
        config: {
          url: '/signin',
          templateUrl: "/app/blocks/auth/login.html",
          controller: 'SigninController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'auth.signout',
        config: {
          controller: 'SignoutController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'auth.forgot',
        config: {
          url: '/forgot',
          templateUrl: "/app/blocks/auth/login_forgot.html",
          controller: 'ForgotController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'auth.registration',
        config: {
          url: '/registration',
          templateUrl: "/app/blocks/auth/login_registration.html"
        }
      },
      {
        state: 'auth.reset',
        config: {
          url: '/reset',
          templateUrl: "/app/blocks/auth/reset_password.html",
          controller: 'ResetController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'auth.lockscreen',
        config: {
          url: '/lock',
          templateUrl: "/app/blocks/auth/login_lock_screen.html"
        }
      },
      {
        state: 'auth.passwordUrlExpired',
        config: {
          url: '/passwordUrlExpired',
          templateUrl: "/app/core/password-expire.html"
        }
      }
    ];
  }
})();
