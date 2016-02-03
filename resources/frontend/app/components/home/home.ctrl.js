(function() {

    'use strict';

    //sub module declaration for Home page
    angular
        .module('jotanguApp.home', ['ui.router'])
        .config (ConfigHome)
        .controller ('HomeCtrl', HomeCtrl);

    ConfigHome.$inject = ['$stateProvider'];

    function ConfigHome ($stateProvider) {

        //set path for home page
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/app/components/home/home.html', //view template
                controller: 'HomeCtrl', //view controller
                controllerAs: 'home' //controller's shortcut within template
            });
    }

    HomeCtrl.$inject = ['$rootScope'];

    function HomeCtrl ($rootScope) {

        //set current path for setting the active nav bar menu item
        $rootScope.curPath = 'home';
    }

})();