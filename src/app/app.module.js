(function() {
    'use strict';

    angular.module('app.core', [
        'app.nav',
        'app.complaint',
        'app.admin',
        'app.notice',
        'app.reports',
        'blocks.auth',
        'app.userMenu',
        'app.user',
        'app.visitors'
    ]);
})();
