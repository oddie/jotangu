(function() {

    'use strict';

    //application module declaration
    angular
        .module('jotanguApp', [
            'ui.router',
            'angular-loading-bar',
            'jotanguApp.home',
            'jotanguApp.navbar',
            'jotanguApp.signin',
            'jotanguApp.signup',
            'jotanguApp.profile'

        ])
        .config (Config);

    Config.$inject = ['$locationProvider', '$urlRouterProvider'];

    function Config ($locationProvider, $urlRouterProvider) {

        //remove hash sign in urls
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        //set default route
        $urlRouterProvider.otherwise('/');
    }

})();