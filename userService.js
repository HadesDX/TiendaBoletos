module.exports = function (db, Authentication) {
    var express = require('express');
    var router = express.Router();

    router.route('/').get(Authentication.BasicAuthentication, function (req, res, next) {
        db.collection('user').find().toArray().then(function (result) {
            if (!result) {
                res.status(404).json({message: "Not found"});
                return;
            }
            res.status(200).json({message: "OK", data: result});
        }, function (error) {
            console.log(error);
            res.status(500).json({message: "Error database"});
        });
    });

    router.route('/').post(function (req, res, next) {
        var body = req.body;
        if (!body || !body.email || !body.password) {
            res.status(400).json({message: "Non user"});
            return;
        }

        db.collection('user').findOne({email: body.email}).then(function (result) {
            if (result) {
                res.status(400).json({message: "This email its already taken"});
                return;
            }

            db.collection('user').insertOne(body).then(function (result) {
                res.status(201).json({message: "OK", data: result.insertedId});
            }, function (error) {
                console.log(error);
                res.status(500).json({message: "Error database"});
            });
        }, function (error) {
            console.log(error);
            res.status(500).json({message: "Error database"});
        });
    });

    router.route('/login').post(function (req, res, next) {
        var body = req.body;
        if (!body || !body.email || !body.password) {
            res.status(400).json({message: "Non user"});
            return;
        }
        db.collection('user').findOne(body).then(function (result) {
            if (!result) {
                res.status(400).json({message: "Not found"});
                return;
            }
            res.status(200).json({message: "OK", data: result});
        }, function (error) {
            console.log(error);
            res.status(500).json({message: "Error database"});
        });
    });

    router.route('/:id').get(Authentication.BasicAuthentication, function (req, res, next) {
        var user = req.params.id;
        var id = null;
        try {
            id = new require('mongodb').ObjectID(user);
        } catch (e) {
            res.status(400).json({message: "Non user"});
            return;
        }
        db.collection('user').findOne({_id: id}).then(function (result) {
            if (!result) {
                res.status(404).json({message: "Not found"});
                return;
            }
            res.status(200).json({message: "OK", data: result});
        }, function (error) {
            console.log(error);
            res.status(500).json({message: "Error database"});
        });
    });

    router.route('/:id').put(Authentication.BasicAuthentication, function (req, res, next) {
        var user = req.params.id;
        var id = null;
        try {
            id = new require('mongodb').ObjectID(user);
        } catch (e) {
            res.status(400).json({message: "Non user"});
            return;
        }
        db.collection('user').updateOne({_id: id}, {$set: req.body}).then(function (result) {
            if (!result) {
                res.status(404).json({message: "Not found"});
                return;
            }
            res.status(200).json({message: "Updated if exist"});
        }, function (error) {
            console.log(error);
            res.status(500).json({message: "Error database"});
        });
    });

    router.route('/:id').delete(Authentication.BasicAuthentication, function (req, res, next) {
        var user = req.params.id;
        var id = null;
        try {
            id = new require('mongodb').ObjectID(user);
        } catch (e) {
            res.status(400).json({message: "Non user"});
            return;
        }
        db.collection('user').deleteOne({_id: id}).then(function (result) {
            if (!result) {
                res.status(404).json({message: "Not found"});
                return;
            }
            res.status(204).json({message: "Deleted if existed"});
        }, function (error) {
            console.log(error);
            res.status(500).json({message: "Error database"});
        });
    });

    return router;
};