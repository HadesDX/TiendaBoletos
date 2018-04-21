(function () {
    'use strict';

    angular.module('AccessMaster').controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService'];
    function LoginController($location, AuthenticationService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            console.log('login');
            vm.dataLoading = true;
            AuthenticationService.Login(vm.email, vm.password, function (response) {
                console.log(response);
                if (response.success) {
                    AuthenticationService.SetCredentials(vm, response);
                    console.log('Credentials set');
                    $location.path('/profile');
                } else {
                    console.log('Login error');
                    vm.dataLoading = false;
                    vm.message = response.data.message;
                }
            }, function (a, b, c, d) {
                console.log('error');
            });
        }
    }
})();