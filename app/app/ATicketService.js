(function () {
    angular.module('AccessMaster')
            .factory('TicketService', ['$http', function ($http) {
                    var service = {};

                    service.GetByUser = GetByUser;
                    service.Buy = Create;

                    return service;

                    function GetByUser(userId) {
                        return $http.get('/ws/ticket/' + userId).then(handleSuccess, handleError);
                    }
                    function Create(data) {
                        return $http.post('/ws/ticket/', data).then(handleSuccess, handleError);
                    }
                    function handleSuccess(res) {
                         return {success: true, data: res.data};
                    }
                    function handleError(error) {
                        return {success: false, message: error.data.message};
                    }
                }
            ]);
})();