'use strict';

/**
 * Config for the router
 */
app.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
function ($httpProvider, $stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires) {

    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.constant = $provide.constant;
    app.value = $provide.value;

    // LAZY MODULES

    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: jsRequires.modules
    });

    // APPLICATION ROUTES
    // -----------------------------------
    // For any unmatched url, redirect to /app/dashboard
    $urlRouterProvider.otherwise("/auth/view");
    //
    // Set up the state
    $stateProvider.state('app', {
        url: "/app",
        templateUrl: "app/app.html",
        // resolve: {
        //   authorize: ['authorization',
        //     function (authorization) {
        //       return authorization.authorize().$promise;
        //     }
        //   ]
        // },
        abstract: true
    }).state('app.society', {
      url: "/society",
      templateUrl: "app/admin/society/societyList.html",
      resolve: loadSequence('d3', 'ui.knob', 'countTo'),
      title: 'Society',
      params: {
        msg: null
      },
      controller: 'SocietyListCtrl',
      controllerAs: 'vm',
      ncyBreadcrumb: {
        label: 'Society'
      }
    }).state('app.userProfile', {
        url: '/user-profile',
        templateUrl: "app/user-menu/user-profile.html",
        controller: 'UserProfileCtrl',
        controllerAs: 'vm',
        title: 'User Profile',
        ncyBreadcrumb: {
            label: 'User Profile'
        },
        resolve: loadSequence('flow', 'userCtrl')
    }).state('app.changepassword', {
      url: '/changepassword',
      templateUrl: "app/user-menu/changePassword.html",
      controller: 'ChangePasswordController',
      controllerAs: 'vm',
      title: 'Change Password',
      ncyBreadcrumb: {
        label: 'Change Password'
      },
      resolve: loadSequence('flow', 'userCtrl')
    }).state('error', {
        url: '/error',
        template: '<div ui-view class="fade-in-up"></div>'
    }).state('error.404', {
        url: '/404',
        templateUrl: "views/utility_404.html",
    }).state('error.500', {
        url: '/500',
        templateUrl: "views/utility_500.html",
    })

	// Login routes

	.state('auth', {
	    url: '/auth',
        templateUrl: 'app/blocks/auth/auth.html',
        controller: 'AuthController',
        controllerAs: 'vm',
	    abstract: true
	}).state('auth.view', {
	    url: '/view',
	    templateUrl: 'app/blocks/auth/view.html',
        controller: 'SigninController',
        controllerAs: 'vm'
	}).state('auth.product', {
	    url: '/product',
	    templateUrl: 'app/blocks/auth/product.html'
	}).state('auth.feature', {
	    url: '/feature',
	    templateUrl: 'app/blocks/auth/feature.html'
	}).state('auth.pricing', {
	    url: '/pricing',
	    templateUrl: 'app/blocks/auth/pricing.html'
	}).state('auth.gdpr', {
	    url: '/gdpr',
	    templateUrl: 'app/blocks/auth/gdpr.html'
	}).state('auth.signin', {
	    url: '/signin',
	    templateUrl: 'app/blocks/auth/login.html',
      controller: 'SigninController',
      controllerAs: 'vm'
	}).state('auth.validate', {
	    url: '/validate',
	    templateUrl: 'app/blocks/auth/login_validation.html',
      controller: 'SigninController',
      controllerAs: 'vm'
	}).state('auth.signUp', {
        url: '/signup',
        templateUrl: 'app/blocks/auth/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm'
    }).state('auth.signout',{
      controller: 'SignoutController',
      controllerAs: 'vm'
    }).state('auth.forgot', {
	    url: '/forgot',
	    templateUrl: "app/blocks/auth/login_forgot.html",
      controller: 'ForgotController',
      controllerAs: 'vm'
	}).state('login.registration', {
	    url: '/registration',
	    templateUrl: "views/login_registration.html"
	}).state('login.lockscreen', {
	    url: '/lock',
	    templateUrl: "views/login_lock_screen.html"
    })
    .state('company', {
	    url: '/company',
        templateUrl: 'app/blocks/company/company.html',
        controller: 'CompanyLayoutController',
        controllerAs: 'vm',
	    abstract: true
	}).state('company.goal', {
	    url: '/goal',
	    templateUrl: 'app/blocks/company/goal.html',
        controller: 'CompanyDetailsController',
        controllerAs: 'vm'
	}).state('company.details', {
	    url: '/details',
	    templateUrl: 'app/blocks/company/details.html',
        controller: 'CompanyDetailsController',
        controllerAs: 'vm'
	}).state('company.teams', {
	    url: '/teams',
	    templateUrl: 'app/blocks/company/teams.html',
        controller: 'CompanyDetailsController',
        controllerAs: 'vm'
    }).state('company.timeOff', {
	    url: '/time-off',
	    templateUrl: 'app/blocks/company/time-off.html',
        controller: 'CompanyMiscController',
        controllerAs: 'vm'
	}).state('company.documentFolders', {
	    url: '/documentFolders',
	    templateUrl: 'app/blocks/company/documentFolders.html',
        controller: 'CompanyMiscController',
        controllerAs: 'vm'
	}).state('company.slides', {
	    url: '/slides',
	    templateUrl: 'app/blocks/company/slides.html',
        controller: 'CompanyUploadController',
        controllerAs: 'vm'
	}).state('company.members', {
	    url: '/members',
	    templateUrl: 'app/blocks/company/members.html',
        controller: 'CompanyDetailsController',
        controllerAs: 'vm'
	})

	// Landing Page route
	.state('landing', {
	    url: '/landing-page',
	    template: '<div ui-view class="fade-in-right-big smooth"></div>',
	    abstract: true,
	    resolve: loadSequence('jquery-appear-plugin', 'ngAppear', 'countTo')
	}).state('landing.welcome', {
	    url: '/welcome',
	    templateUrl: "views/landing_page.html"
	});
  // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
    function loadSequence() {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q',
			function ($ocLL, $q) {
			    var promise = $q.when(1);
			    for (var i = 0, len = _args.length; i < len; i++) {
			        promise = promiseThen(_args[i]);
			    }
			    return promise;

			    function promiseThen(_arg) {
			        if (typeof _arg == 'function')
			            return promise.then(_arg);
			        else
			            return promise.then(function () {
			                var nowLoad = requiredData(_arg);
			                if (!nowLoad)
			                    return $.error('Route resolve: Bad resource name [' + _arg + ']');
			                return $ocLL.load(nowLoad);
			            });
			    }

			    function requiredData(name) {
			        if (jsRequires.modules)
			            for (var m in jsRequires.modules)
			                if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
			                    return jsRequires.modules[m];
			        return jsRequires.scripts && jsRequires.scripts[name];
			    }
			}]
        };
    }
}]);
