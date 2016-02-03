(function() {

    'use strict';

    //application module declaration
    angular
        .module('jotanguApp.signin', ['satellizer', 'ui.router', 'jotanguApp.auth.svc'])
        .config (ConfigSignin)
        .controller('SigninCtrl', SigninCtrl);

    ConfigSignin.$inject = ['$stateProvider'];

    function ConfigSignin ($stateProvider) {

        $stateProvider
            .state('signin', {
                url: '/signin', //path to sign in page
                templateUrl: '/app/components/signin/signin.html', //sign in view template
                controller: 'SigninCtrl', //sign in view controller
                controllerAs: 'signin' //sign in view controller's shortcut
            });
    }

    //injecting dependencies
    SigninCtrl.$inject = ['$state','AuthService'];

    function SigninCtrl ($state, AuthService) {

        var vm = this;

        //error messages model
        //this for representing errors if sign in data is incorrect
        vm.error = {first_name:'', last_name:'', email: '', password:''};

        vm.login = login; //function for log in user
        vm.socialLogin = socialLogin; //function for log in using social services

        function login () {
            // get credentials from sign in form
            var credentials = {
                email: vm.email,
                password: vm.password
            }

            //just call out authentication service method to log in
            AuthService.login(credentials, cbSuccess, cbError);

            //callback function for process successfull
            function cbSuccess () {
                $state.go('profile', {});
            }

            function cbError (response) {
                //clear previous errors
                vm.error.email = '';
                vm.error.password = '';

                //check response status when error and show a message
                if (response.status === 401) {
                    // login or password don't match
                    vm.error.password = 'Invalid credentials. Check your e-mail and password.';
                    return;
                }
                if (response.status === 422) {
                    //show errors for corresponding form fields
                    if (response.data.email) vm.error.email = response.data.email[0];
                    if (response.data.password) vm.error.password = response.data.password[0];
                } else {
                    //some other error has occured
                    vm.error.password = 'Server error. Try again.';
                }
            }
        }

        function socialLogin (provider) {
            AuthService.loginSocial(provider, cbSuccess, cbError);

            function cbSuccess (response) {
                console.log(response);
                $state.go('profile', {});
            }

            function cbError(response) {
                console.log(response);
            }
        }
    }

})();