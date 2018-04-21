var express = require('express');
var router = express.Router();
const paypal = require('paypal-rest-sdk');

//Paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ASB-PXxpwY9OY2xxLlomIvWAsgiBiG-lPSHe7REmbDj1ayMQeObyu3LhlWoLmI-OZmS8yh-UgkTijCNr',
    'client_secret': 'EO10z4kPnh8IfAgSD43_tS7Px_c2wMoRbMhxndYffXme3TDqBJvfROo0_cjl9-Xoez7g7H6XrskSOhB3'
});

module.exports = function (db, Authentication) {
    var createPay = function (payment) {
        return new Promise((resolve, reject) => {
            paypal.payment.create(payment, function (err, payment) {
                console.log('paypal.payment.create');
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(payment);
                    resolve(payment);
                }
            });
        });
    };

    router.route('/payPal').get(function (req, res, next) {
        console.log('PayPal');
        var paymentId = req.query.paymentId;
        var payerId = {'payer_id': req.query.PayerID};
        console.log(paymentId);
        console.log(payerId);

        paypal.payment.execute(paymentId, payerId, function (error, payment) {
            if (error) {
                console.error(error);
            } else {
                if (payment.state === 'approved') {
                    console.log(payment);
                    db.collection('paypal').findOne({transaction: paymentId}).then(function (result) {
                        var tickets = new Array();

                        for (var i = 0; i < result.tickets; ++i) {
                            tickets.push({userid: new require('mongodb').ObjectID(result.userid), eventid: new require('mongodb').ObjectID(result.eventid)});
                        }
                        db.collection('ticket').insertMany(tickets).then(function () {
                            res.redirect('/buySuccess');
                        }, function () {
                            res.redirect('/buyError');
                        });
                    }, function (result) {
                        res.redirect('/buyError');
                    });
                } else {
                    res.redirect('/buyError');
                }
            }
        });
    });

    router.route('/:iduser').get(Authentication.BasicAuthentication, function (req, res, next) {
        var user = req.params.iduser;
        var id = null;
        try {
            id = new require('mongodb').ObjectID(user);
        } catch (e) {
            res.status(400).json({message: "Non user"});
            return;
        }
        db.collection('ticket').aggregate([
            {$match: {userid: id}},
            {$lookup: {from: "event", localField: "eventid", foreignField: "_id", as: "events"}}
        ]).toArray().then(function (result) {
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
        // start payment process 
        console.log('POST data');
        var data = req.body;
        console.log(data);
        //Load event price and prepare charge
        // create payment object 
        var userid = new require('mongodb').ObjectID(data.userid);
        var eventid = new require('mongodb').ObjectID(data.eventid);

        db.collection('event').findOne({_id: eventid}).then(function (event) {
            console.log('FindOne');
            console.log(event);
            console.log(event.ticketsSold);
            console.log(data.tickets);
            console.log(event.tickets);
            var t = (event.ticketsSold + data.tickets) < event.tickets;
            console.log(t);
            if (t) {
                console.log('Hay tickets aun!');
                var cost = 0 + (parseInt(data.tickets) * event.price);
                console.log(cost);
                console.log(typeof cost);
                var payment = {
                    "intent": "authorize",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://localhost:3000/ws/ticket/payPal",
                        "cancel_url": "http://localhost:3000/buyError"
                    },
                    "transactions": [{
                            "amount": {
                                "total": cost,
                                "currency": "MXN"
                            },
                            "description": data.tickets + " Tickets"
                        }]
                };

                console.log(payment);
                // call the create Pay method 
                createPay(payment).then(function (transaction) {
                    console.log('createPay promise');
                    console.log(transaction);
                    data.transaction = transaction.id;
                    db.collection('paypal').insertOne(data).then(function (result) {
                        var id = transaction.id;
                        var links = transaction.links;
                        var counter = links.length;
                        while (counter--) {
                            if (links[counter].method === 'REDIRECT') {
                                console.log('Redirect');
                                // redirect to paypal where user approves the transaction 
                                res.status(200).json({message: "OK", data: links[counter].href});
                                return;
                            }
                        }

                    }, function (result) {
                        res.status(400).json({message: "OK", data: 'Error proccesing payment'});
                    });
                }).catch(function (err) {
                    console.log(err);
                    res.status(400).json({message: "OK", data: 'Error proccesing payment'});
                });
            } else {
                res.status(400).json({message: "Not enought tickets available"});
                return;
            }
        }, function (error) {
            console.log(error);
            res.status(500).json({message: "Error database"});
            return;
        });

    });

    return router;
};