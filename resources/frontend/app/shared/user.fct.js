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