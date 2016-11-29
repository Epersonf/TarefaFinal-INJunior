var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Peca = require('../models/pecas');

var pecaRouter = express.Router();
pecaRouter.use(bodyParser.json());

pecaRouter.route('/')
.get(function (req, res, next) {
    Peca.find({}, function (err, peca) {
        if (err) throw err;
        res.json(peca);
    });
})

.post(function (req, res, next) {
    Peca.create(req.body, function (err, peca) {
        if (err) throw err;
        console.log('peca criada');
        var id = peca._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Peça adicionada');
    });
})

.delete(function (req, res, next) {
    Peca.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

module.exports = pecaRouter;