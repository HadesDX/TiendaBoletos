(function () {
    'use strict';

    angular.module('AccessMaster').controller('MyEventsController', MyEventsController);

    MyEventsController.$inject = ['EventService', '$location', '$rootScope'];
    function MyEventsController(EventService, $location, $rootScope) {
        var c = this;
        this.events = [];
        EventService.MyEvents($rootScope.globals.currentUser._id).then(function (response) {
            c.events = response.data.data;
            console.log(c.events);
        }, function (data) {
            console.log(data);
        });
    }

})();