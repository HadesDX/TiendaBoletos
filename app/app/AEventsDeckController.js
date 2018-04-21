(function () {
    'use strict';

    var app = angular.module('AccessMaster');

    app.controller('EventListController', ['$http', 'EventService', function ($http, EventService) {
            var c = this;
            c.qty = 4;
            c.start = 0;
            c.events = [];
            EventService.SoonToEnd(c.start, c.qty).then(function (data) {
                c.events = data.data.data;
            }, function (error) {
                console.log(error);
            });
            this.next = function () {
                c.start += c.qty;
                EventService.SoonToEnd(c.start, c.qty).then(function (data) {
                    c.events = data.data.data;
                }, function (error) {
                    console.log(error);
                });
            };
            this.back = function () {
                c.start -= c.qty;
                if (c.start < 0) {
                    c.start = 0;
                }
                EventService.SoonToEnd(c.start, c.qty).then(function (data) {
                    c.events = data.data.data;
                }, function (error) {
                    console.log(error);
                });
            };
            //$http.get('/ws/event/soonToEnd')
        }]);

    app.controller('EventController', ['$http', '$routeParams', 'EventService', function ($http, $routeParams, EventService) {
            var c = this;
            c.event = null;
            EventService.GetById($routeParams.id).then(function (data) {
                c.event = data.data.data;
            }, function (error) {
                console.log(error);
            });
        }]);

    app.directive('eventCardDeck', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/template/eventCardDeck.html',
            controller: 'EventListController',
            controllerAs: 'listEvents'
        };
    });

    app.directive('eventCard', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/template/eventCard.html',
            controller: 'EventController',
            controllerAs: 'event'
        };
    });

})();