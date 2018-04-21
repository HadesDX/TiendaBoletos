(function () {
        angular.module('AccessMaster')
            .factory('AuthenticationService', AuthenticationService);
 
        AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService'];
        function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService) {
        var service = {};
 
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
 
        return service;
 
        function Login(username, password, callback, errcallback) {
             var response = null;
            UserService.GetByUserPass(username, password)
                    .then(function (data) {
                        console.log('Login');
                        console.log(data);
                        if (data.success) {
                            response = {success: true, data: data.data.data};
                        } else {
                            response = {success: false, data: data};
                        }
                        callback(response);
                    }, function (a, b, c, d) {
                        console.log(a, b, c, d);
                        errcallback(a, b, c, d);
                    });
        }
        function SetCredentials(data, response) {
            var authdata = window.btoa(data.email + ':' + data.password);
            console.log('SetCredentials');
            console.log(response);
            $rootScope.globals = {
                currentUser: response.data
            };
            response.data.authdata = authdata;
 
            // set default auth header for http requests
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
 
            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, {expires: cookieExp});
        }
        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
        }
 })();