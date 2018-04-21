(function () {
    'use strict';

    angular.module('AccessMaster').controller('BuyTicketController', BuyTicketController);

    BuyTicketController.$inject = ['EventService', 'TicketService', '$location', '$rootScope', '$routeParams'];
    function BuyTicketController(EventService, TicketService, $location, $rootScope, $routeParams) {
        var c = this;
        this.id = $routeParams.id;
        this.event = null;
        this.binfo;

        EventService.GetById(this.id).then(function (response) {
            console.log(response.data.data);
            c.event = response.data.data;
        }, function (error) {
            console.log(error);
        });
        console.log(this.id);
        console.log('Buy Ticket');

        this.buy = function () {
            c.binfo.userid = $rootScope.globals.currentUser._id;
            c.binfo.eventid = c.event._id;
            console.log('buy');
            console.log(c.binfo);
            TicketService.Buy(c.binfo).then(function (response) {
                console.log(response);
                if (response.success) {
                    window.location.href = response.data.data;
                } else {
                    c.message = response.message;
                }
            }, function (error) {
                console.log(error);
                //window.location.href = error.data.data;
            });
        };
    }

})();