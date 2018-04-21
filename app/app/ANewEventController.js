(function () {
    'use strict';

    angular.module('AccessMaster').controller('NewEventController', NewEventController);

    NewEventController.$inject = ['EventService', '$location', '$rootScope'];
    function NewEventController(EventService, $location, $rootScope) {
        var c = this;

        this.register = function () {
            c.dataLoading = true;
            c.event.ticketsSold = 0;
            c.event.userid = $rootScope.globals.currentUser._id;
            console.log(c.event);
            EventService.Create(c.event).then(function (response) {
                console.log(response);
                if (response.success) {
                    bootbox.dialog({
                        title: 'Event created',
                        message: "<p>Your event is up and ready!</p>",
                        buttons: {
                            ok: {
                                label: "Awesome!",
                                className: 'btn-success'
                            }
                        }
                    });
                    $location.path('/event/' + response.data.data);
                } else {
                    c.dataLoading = false;
                    c.message = response.message;
                }
            });
        };
    }

})();