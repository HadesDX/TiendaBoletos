module.exports = function (db, Authentication) {
    var express = require('express');
    var router = express.Router();
    
    router.route('/soonToEnd').post(function (req, res, next) {
        //, ticketsSold: {$lte: "$tickets"}
        
        console.log(req.body);
        db.collection('event').find({maxDate: {$gte: new Date().toISOString()}}).sort({maxDate: 1}).skip(req.body.start).limit(req.body.qty).toArray().then(function (result) {
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
    
    router.route('/').post(Authentication.BasicAuthentication, function (req, res, next) {
        req.body.userid = new require('mongodb').ObjectID(req.body.userid);
        db.collection('event').insertOne(req.body).then(function (result) {
            res.status(201).json({message: "OK", data: result.insertedId});
        }, function (error) {
            console.log(error);
            res.status(500).json({message: "Error database"});
        });
    });
    router.route('/myEvents/:userid').get(Authentication.BasicAuthentication, function (req, res, next) {
        var event = req.params.userid;
        var id = null;
        try {
            id = new require('mongodb').ObjectID(event);
        } catch (e) {
            res.status(400).json({message: "Non event"});
            return;
        }
        db.collection('event').find({userid: id}).sort({maxDate: 1}).toArray().then(function (result) {
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
    
    router.route('/:id').get(function (req, res, next) {
        var event = req.params.id;
        var id = null;
        try {
            id = new require('mongodb').ObjectID(event);
        } catch (e) {
            res.status(400).json({message: "Non event"});
            return;
        }
        db.collection('event').findOne({_id: id}).then(function (result) {
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
        var event = req.params.id;
        var id = null;
        try {
            id = new require('mongodb').ObjectID(event);
        } catch (e) {
            res.status(400).json({message: "Non event"});
            return;
        }
        db.collection('event').updateOne({_id: id}, {$set: req.body}).then(function (result) {
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
        var event = req.params.id;
        var id = null;
        try {
            id = new require('mongodb').ObjectID(event);
        } catch (e) {
            res.status(400).json({message: "Non event"});
            return;
        }
        db.collection('event').deleteOne({_id: id}).then(function (result) {
            if (!result) {
                res.status(404).json({message: "Not found"});
                return;
            }
            res.status(200).json({message: "Deleted if existed"});
        }, function (error) {
            console.log(error);
            res.status(500).json({message: "Error database"});
        });
    });
    
    return router;
};