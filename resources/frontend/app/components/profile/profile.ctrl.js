(function() {

    'use strict';

    //sub module declaration for Profile page
    angular
        .module('jotanguApp.profile', ['jotanguApp.user.fct', 'jotanguApp.auth.svc', 'ui.router'])
        .config (ConfigProfile)
        .controller('ProfileCtrl', ProfileCtrl);

    ConfigProfile.$inject = ['$stateProvider'];

    function ConfigProfile ($stateProvider) {

        $stateProvider
            .state('profile', {
                url: '/profile',
                templateUrl: '/app/components/profile/profile.html', //profile view template
                controller: 'ProfileCtrl', //profile view controller
                controllerAs: 'profile' //shortcut for profile view controller
            });
    }

    //injecting dependencies
    ProfileCtrl.$inject = ['$rootScope', '$scope', '$state', 'AuthService', 'UserFactory'];

    function ProfileCtrl ($rootScope, $scope, $state, AuthService, UserFactory) {

        var vm = this;

        //set current path for setting the active nav bar menu item
        $rootScope.curPath = 'profile';

        //the profile view may be shown only if the user is signed in
        //if not redirect to sign in page
        if (!AuthService.isAuthenticated()) {
            $state.go('signin');
        }

        //get current user profile data from factory
        //it returns null if the user is not signed in
        vm.user = UserFactory.user();

        $scope.$on ('reloadUser', function (event, data) {
            //catch an event fired when user data in our user factory has changed
            //and update user data stored in controller
            //this is necessary for representing user's profile data
            //this controller doesn't know itself when the user factory's data is changed, so we need an event
            vm.user = UserFactory.user();
        });
    }

})();