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