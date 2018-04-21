(function () {
    angular.module('AccessMaster')
            .factory('EventService', ['$http', function ($http) {
                    var service = {};

                    service.SoonToEnd = SoonToEnd;
                    service.MyEvents = MyEvents;
                    service.GetById = GetById;
                    service.Create = Create;
                    service.Update = Update;
                    service.Delete = Delete;

                    return service;

                    function SoonToEnd(start, qty) {
                        return $http.post('/ws/event/soonToEnd/', {start: start, qty: qty}).then(handleSuccess, handleError);
                    }
                    function MyEvents(id) {
                        return $http.get('/ws/event/myEvents/' + id).then(handleSuccess, handleError);
                    }
                    function GetById(id) {
                        return $http.get('/ws/event/' + id).then(handleSuccess, handleError);
                    }
                    function Delete(id) {
                        return $http.delete('/ws/event/' + id).then(handleSuccess, handleError);
                    }
                    function Create(event) {
                        return $http.post('/ws/event', event).then(handleSuccess, handleError);
                    }
                    function Update(event) {
                        return $http.put('/ws/event/' + event.id, event).then(handleSuccess, handleError);
                    }

                    function handleSuccess(res) {
                        console.log('success http');
                        console.log(res);
                         return {success: true, data: res.data};
                    }
                    function handleError(error) {
                        console.log('error http');
                        console.log(error);
                        return {success: false, message: error.data.message};
                    }
                }
            ]);
})();