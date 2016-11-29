var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Supervisor = require('../models/supervisores');

var supervisorRouter = express.Router();
supervisorRouter.use(bodyParser.json());

supervisorRouter.route('/')
.get(function (req, res, next) {
    Supervisor.find({}, function (err, supervisor) {
        if (err) throw err;
        res.json(supervisor);
    });
})

.post(function (req, res, next) {
    Supervisor.create(req.body, function (err, supervisor) {
        if (err) throw err;
        console.log('supervisor criado');
        var id = supervisor._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Supervisor adicionado');
    });
})

.delete(function (req, res, next) {
    Supervisor.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

supervisorRouter.route('/:id')
.get(function (req, res, next) {
    Supervisor.findById(req.params.id, function (err, supervisor) {
        if (err) throw err;
        res.json(supervisor);
    });
})

.put(function (req, res, next) {
    Supervisor.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function (err, supervisor) {
        if (err) throw err;
        res.json(supervisor);
    });
})

.delete(function (req, res, next) {
    Supervisor.findByIdAndRemove(req.params.id, function (err, resp) {        
	if (err) throw err;
        res.json(resp);
    });
});

supervisorRouter.route('/pessoal/:pessoa')
.get(function (req, res, next) {
    Log.find({"pessoaId": req.params.pessoa}, function (err, log) {
        if (err) throw err;
        res.json(log);
    });
})

.delete(function (req, res, next) {
    Log.remove({"pessoaId": req.params.pessoa}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

module.exports = supervisorRouter;