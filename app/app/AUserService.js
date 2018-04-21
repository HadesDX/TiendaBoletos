(function () {
    angular.module('AccessMaster')
            .factory('UserService', ['$http', function ($http) {
                    var service = {};

                    service.GetAll = GetAll;
                    service.GetById = GetById;
                    service.GetByUserPass = GetByUserPass;
                    service.Create = Create;
                    service.Update = Update;
                    service.Delete = Delete;

                    return service;

                    function GetAll() {
                        return $http.get('/ws/user/').then(handleSuccess, handleError);
                    }
                    function GetByUserPass(username, password) {
                        return $http.post('/ws/user/login', {email: username, password: password}).then(handleSuccess, handleError);
                    }
                    function GetById(id) {
                        return $http.get('/ws/user/' + id).then(handleSuccess, handleError);
                    }
                    function Delete(id) {
                        return $http.delete('/ws/user/' + id).then(handleSuccess, handleError);
                    }
                    function Create(user) {
                        return $http.post('/ws/user', user).then(handleSuccess, handleError);
                    }
                    function Update(id, user) {
                        console.log('update', user);
                        return $http.put('/ws/user/' + id, user).then(handleSuccess, handleError);
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