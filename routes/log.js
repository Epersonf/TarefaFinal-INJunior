var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Log = require('../models/log');

var logRouter = express.Router();
logRouter.use(bodyParser.json());

logRouter.route('/')
.get(function (req, res, next) {
    Log.find({}, function (err, log) {
        if (err) throw err;
        res.json(log);
    });
})

.post(function (req, res, next) {
    Log.create(req.body, function (err, log) {
        if (err) throw err;
        console.log('log criado');
        var id = log._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Log anotado');
    });
})

.delete(function (req, res, next) {
    Log.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

logRouter.route('/ator/:id')
.get(function (req, res, next) {
    Log.find({"atorId": req.params.id}, function (err, log) {
        if (err) throw err;
        res.json(log);
    });
})

.delete(function (req, res, next) {
    Log.remove({"atorId": req.params.id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

logRouter.route('/objeto/:id')
.get(function (req, res, next) {
    Log.find({"objetoId": req.params.id}, function (err, log) {
        if (err) throw err;
        res.json(log);
    });
})

.delete(function (req, res, next) {
    Log.remove({"objetoId": req.params.id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

module.exports = logRouter;