(function () {
    'use strict';

    angular.module('AccessMaster').controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location'];
    function RegisterController(UserService, $location) {
        var c = this;

        this.register = function () {
            c.dataLoading = true;
            UserService.Create(c.user)
                    .then(function (response) {
                        if (response.success) {
                            bootbox.dialog({
                                title: 'You are almost ready to rock!',
                                message: "<p>Register succesful, please login to continue</p>",
                                buttons: {
                                    ok: {
                                        label: "Take me to login!",
                                        className: 'btn-success'
                                    }
                                }
                            });
                            $location.path('/login');
                        } else {
                            c.dataLoading = false;
                            c.message = response.message;
                        }
                    });
        };
    }

})();