(function () {
    'use strict';

    angular.module('AccessMaster').controller('UserLogedController', UserLogedController);

    UserLogedController.$inject = ['$location', '$rootScope', 'AuthenticationService'];
    function UserLogedController($location, $rootScope, AuthenticationService) {
        var vm = this;
        this.global = $rootScope;
        this.logout = function () {
            console.log('logout');
            AuthenticationService.ClearCredentials();
            $location.path('/login');
        };
    }
})();