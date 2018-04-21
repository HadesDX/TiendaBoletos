(function () {
    'use strict';

    var app = angular.module('AccessMaster');
    app.controller('ProfileController', ['UserService', 'TicketService', 'EventService', '$rootScope', ProfileController]);
    function ProfileController(UserService, TicketService, EventService, $rootScope) {
        var c = this;
        this.profile = {tickets: []};

        UserService.GetById($rootScope.globals.currentUser._id).then(function (response) {
            c.profile = response.data.data;
            TicketService.GetByUser($rootScope.globals.currentUser._id).then(function (response) {
                c.profile.tickets = response.data.data;
            }, function (data) {
                console.log(data);
            });
        }, function (data) {
            console.log(data);
        });
    }

    app.controller('ProfilePassController', ['UserService', 'AuthenticationService', '$rootScope', '$location', ProfilePassController]);
    function ProfilePassController(UserService, AuthenticationService, $rootScope, $location) {
        var o = this;
        this.register = function () {
            o.dataLoading = true;
            o.userN = {};
            o.userN.password = o.user.password;
            UserService.Update($rootScope.globals.currentUser._id, o.userN)
                    .then(function (response) {
                        if (response.success) {
                            bootbox.dialog({
                                title: 'You are almost ready to rock!',
                                message: "<p>Change succesful, please login to continue</p>",
                                buttons: {
                                    ok: {
                                        label: "Take me to login!",
                                        className: 'btn-success'
                                    }
                                }
                            });
                            AuthenticationService.ClearCredentials();
                            $location.path('/login');
                        } else {
                            console.log(response.message);
                            o.dataLoading = false;
                            o.message = response.message;
                        }
                    });
        };
    }

    app.directive('profileTicket', ProfileTicket);
    function ProfileTicket() {
        return {
            restrict: 'E',
            templateUrl: '/app/template/profileTicket.html'
        };
    }
})();