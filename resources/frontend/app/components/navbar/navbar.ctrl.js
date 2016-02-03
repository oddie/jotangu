(function() {

    'use strict';

    //application module declaration
    angular
        .module('jotanguApp.navbar', [
            'jotanguApp.auth.svc',
            'jotanguApp.user.fct'
        ])
        .controller ('NavCtrl', NavCtrl);

    NavCtrl.$inject = ['$scope', '$state', 'AuthService', 'UserFactory'];

    function NavCtrl ($scope, $state, AuthService, UserFactory) {

        var vm = this;

        //get current user profile data from factory
        //it returns null if the user is not signed in
        vm.user = UserFactory.user();

        vm.isAuthenticated = isAuthenticated; //checks if a user is signed in
        vm.logout = logout; // log out current user

        function isAuthenticated() {
            //just wrap up our authentication service's method
            return AuthService.isAuthenticated();
        }

        function logout () {
            //just call our authentication service method to log out
            AuthService.logout();
            //clear all user data in our factory
            UserFactory.clear();
            //redirect to home page after logging out
            $state.go('home');
        }

        $scope.$on ('reloadUser', function (event, data) {
            //catch an event fired when user data in our user factory has changed
            //and update user data stored in controller
            //this is necessary for representing user's first name and last name in the nav bar
            //this controller doesn't know itself when the user factory's data is changed, so we need an event
            vm.user = UserFactory.user();
        });
    }

})();