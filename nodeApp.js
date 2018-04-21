// app.js
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const paypal = require('paypal-rest-sdk');
const MongoClient = require('mongodb').MongoClient;
var Authentication = null;
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//MONGO
MongoClient.connect("mongodb://localhost:27017/nodefinal", function (err, client) {
    if (err) {
        console.log("ERR Conecting database");
        console.log(err);
        return;
    } else {
        console.log("Database connected");
        db = client.db('nodefinal');
        /**
         * API
         */
        var ws = express.Router();
        ws.all('*', function (req, res, next) {
            //console.log(req);
            console.log(req.method + ' ' + req.url);
            next();
        });

        Authentication = require('./basicAuth')(db);

        var user = require('./userService')(db, Authentication);
        var event = require('./eventService')(db, Authentication);
        var ticket = require('./ticketService')(db, Authentication);

        app.use('/ws', ws);
        ws.use('/user', user);
        ws.use('/event', event);
        ws.use('/ticket', Authentication.BasicAuthentication, ticket);
    }

    /**
     * STATIC FILES
     */
    app.use('/', express.static('app'));

    // Default every route except the above to serve the index.html
    app.get('*', function (req, res) {
        res.sendFile(path.resolve(__dirname, 'app', 'index.html'));
    });
});

module.exports = app;  