(function () {
    var app = angular.module('AccessMaster', ['ngRoute', 'ngCookies', 'ngBarcode'])
            .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
                    $routeProvider
                            .when('/', {
                                template: '<event-card-deck></event-card-deck>'
                            })
                            .when('/event/:id', {
                                template: '<event-card></event-card>'
                            })
                            .when('/about', {
                                templateUrl: 'app/template/about.html'
                            })
                            .when('/login', {
                                templateUrl: 'app/template/login.html',
                                controller: 'LoginController',
                                controllerAs: 'vm'
                            })
                            .when('/register', {
                                templateUrl: 'app/template/register.html',
                                controller: 'RegisterController',
                                controllerAs: 'vm'
                            })
                            .when('/profilePass', {
                                templateUrl: 'app/template/profilePass.html',
                                controller: 'ProfilePassController',
                                controllerAs: 'c'
                            })
                            .when('/profile', {
                                templateUrl: 'app/template/profile.html',
                                controller: 'ProfileController',
                                controllerAs: 'c'
                            })
                            .when('/myEvents', {
                                templateUrl: 'app/template/myEvents.html',
                                controller: 'MyEventsController',
                                controllerAs: 'c'
                            })
                            .when('/newEvent', {
                                templateUrl: 'app/template/newEvent.html',
                                controller: 'NewEventController',
                                controllerAs: 'c'
                            })
                            .when('/buyTicket/:id', {
                                templateUrl: 'app/template/buyTicket.html',
                                controller: 'BuyTicketController',
                                controllerAs: 'c'
                            })
                            .when('/buySuccess', {
                                templateUrl: 'app/template/buySuccess.html'
                            })
                            .when('/buyError', {
                                templateUrl: 'app/template/buyError.html'
                            })
                            .otherwise({templateUrl: 'app/template/404.html'});
                    $locationProvider.html5Mode(true);
                }])
            .run(['$rootScope', '$location', '$cookies', '$http', function run($rootScope, $location, $cookies, $http) {
                    // keep user logged in after page refresh
                    $rootScope.globals = $cookies.getObject('globals') || {};
                    if ($rootScope.globals.currentUser) {
                        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
                    }

                    $rootScope.$on('$locationChangeStart', function (event, next, current) {
                        // redirect to login page if not logged in and trying to access a restricted page
                        var ptrn = /\w+/mg;
                        var match;
                        match = ptrn.exec($location.path());
                        if (!match) {
                            match = '/';
                        } else {
                            match = match[0];
                        }
                        var restrictedPage = $.inArray(match, ['profile', 'profilePass', 'myEvents']) !== -1;
                        var loggedIn = $rootScope.globals.currentUser;
                        if (restrictedPage && !loggedIn) {
                            $location.path('/login');
                        }
                    });
                }]);

})();

