var basicAuth = require('basic-auth');
module.exports = function (db) {
    return {
        BasicAuthentication: function (request, response, next) {
            function unauthorized(response) {
                response.set('WWW-Authenticate', 'Basic realm=Authorization Required');
                return response.status(401).json({message: 'Unauthorized'});
            }

            var user = basicAuth(request);
            if (!user || !user.name || !user.pass) {
                return unauthorized(response);
            }

            var u = {email: user.name, password: user.pass};
            db.collection('user').findOne(u).then(function (result) {
                if (!result) {
                    return unauthorized(response);
                }
                return next();
            }, function (error) {
                console.log(error);
                return unauthorized(response);
            });
        }
    };
};