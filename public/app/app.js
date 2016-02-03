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
(function() {

    'use strict';

    //application module declaration
    angular
        .module('jotanguApp.auth.svc', [
            'satellizer'
        ])
        .config (ConfigAuth)
        .service ('AuthService', AuthService);

    ConfigAuth.$inject = ['$authProvider'];

    function ConfigAuth ($authProvider) {

        $authProvider.tokenPrefix = 'jotangu';
        $authProvider.loginOnSignup = true;
        $authProvider.loginUrl = 'http://jotangu.app/api/auth/signin';
        $authProvider.signupUrl = 'http://jotangu.app/api/auth/signup';

        $authProvider.facebook({
            clientId: '181399072221440',
            url: '/api/auth/facebook'
        });

        $authProvider.google({
            clientId: '63464837467-5r6qshnet493jdsa5kq3dto7l22dol9m.apps.googleusercontent.com',
            url: '/api/auth/google'
        });
        $authProvider.twitter({
            clientId: 'T0S6Ql8zwyikGOTSgD7mmz1BO',
            url: '/api/auth/twitter'
        });

        $authProvider.oauth2({
            name: 'vkontakte',
            url: '/api/auth/vkontakte',
            redirectUri:window.location.origin || window.location.protocol + '//' + window.location.host,
            clientId: '5246226',
            authorizationEndpoint: 'http://oauth.vk.com/authorize',
            scope: 'email',
            display: 'popup',
            responseType: 'code',
            requiredUrlParams: ['response_type', 'client_id', 'redirect_uri', 'display', 'scope', 'v'],
            scopeDelimiter: ',',
            v: '5.37'
        });
    }

    AuthService.$inject = ['$auth'];

    function AuthService ($auth) {

        //public declarations
        //-------------------

        //return boolean which indicates whether a user is authenticated
        this.isAuthenticated = isAuthenticated;

        //login with email/password
        this.login = login;

        //logout user
        this.logout = logout;

        //register user with email and password
        this.register = register;

        //authenticate with a social api provider
        this.loginSocial = loginSocial;

        //public implementations
        //----------------------

        function isAuthenticated () {
            //just return satellizer's isAuthenticated() result
            return $auth.isAuthenticated();
        }

        function login (credentials, cbSuccess, cbError) {
            //call satellizer's login and push response into callbacks
            return $auth.login (credentials).then(cbSuccess).catch(cbError);
        }

        function logout () {
            //call satellizer's logout
            $auth.logout();
        }

        function register (userData, cbSuccess, cbError) {
            //call satellizer's signup and push response into callbacks
            return $auth.signup (userData)
                .then(function (response) {
                    $auth.setToken(response);
                    cbSuccess.call();
                })
                .catch(cbError);
        }

        function loginSocial (provider, cbSuccess, cbError) {
            return $auth.authenticate(provider).then(cbSuccess).catch(cbError);
        }
    }

})();
(function() {

    'use strict';

    //application module declaration
    angular
        .module('jotanguApp.user.fct', ['jotanguApp.auth.svc'])
        .factory ('UserFactory', UserFactory);

    UserFactory.$inject = ['$rootScope', '$http', 'AuthService'];

    function UserFactory ($rootScope, $http, AuthService) {

        var self = this;
        self.user = null;

        return {
            user: getUser,
            clear: clearUser
        }

        function getUser() {

            if (self.user) {
                return self.user;
            }

            if (AuthService.isAuthenticated()) {

                $http.get('/api/user/profile')
                    .then(function(response) {
                        self.user = response.data.user;
                        console.log(self.user);
                        $rootScope.$broadcast('reloadUser');
                });
            }

            return self.user;
        }

        function clearUser () {
            delete self.user;
            $rootScope.$broadcast('reloadUser');
        }

    }

})();
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