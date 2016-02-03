(function() {

    'use strict';

    //application module declaration
    angular
        .module('jotanguApp.signup', ['satellizer', 'ui.router', 'jotanguApp.auth.svc'])
        .config (ConfigSignup)
        .controller('SignupCtrl', SignupCtrl);

    ConfigSignup.$inject = ['$stateProvider'];

    function ConfigSignup ($stateProvider) {

        $stateProvider
            .state('signup', {
                url: '/signup',
                templateUrl: '/app/components/signup/signup.html',
                controller: 'SignupCtrl',
                controllerAs: 'signup'
            });
    }


    SignupCtrl.$inject = ['$state','AuthService'];

    function SignupCtrl ($state, AuthService) {

        var vm = this;

        vm.error = {};

        vm.signup = signup;
        vm.socialLogin = socialLogin;

        function signup () {

            var user = {
                first_name: vm.first_name,
                last_name: vm.last_name,
                email: vm.email,
                password: vm.password
            };

            AuthService.register(user, cbSuccess, cbError);

            function cbSuccess(response) {
                $state.go('profile', {});
            }

            function cbError(response) {

                vm.error.first_name = '';
                vm.error.last_name = '';
                vm.error.email = '';
                vm.error.password = '';

                if (response.status === 422) {

                    if (response.data.first_name) vm.error.first_name = response.data.first_name[0];
                    if (response.data.last_name) vm.error.last_name = response.data.last_name[0];
                    if (response.data.email) vm.error.email = response.data.email[0];
                    if (response.data.password) vm.error.password = response.data.password[0];
                }
            }
        }

        function socialLogin (provider) {
            AuthService.loginSocial(provider, cbSuccess, cbError);

            function cbSuccess () {
                $state.go('profile', {});
            }

            function cbError(response) {
                console.log(response);
            }
        }

    }

})();