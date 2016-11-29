var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Fornecedor = require('../models/fornecedores');

var fornecedorRouter = express.Router();
fornecedorRouter.use(bodyParser.json());

fornecedorRouter.route('/')
.get(function (req, res, next) {
    Fornecedor.find({}, function (err, fornecedor) {
        if (err) throw err;
        res.json(fornecedor);
    });
})

.post(function (req, res, next) {
    Fornecedor.create(req.body, function (err, fornecedor) {
        if (err) throw err;
        console.log('fornecedor criada');
        var id = fornecedor._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('fornecedor adicionada com o id: ' + id);
    });
})

.delete(function (req, res, next) {
    Fornecedor.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

fornecedorRouter.route('/:id')
.get(function (req, res, next) {
    Fornecedor.findById(req.params.id, function (err, fornecedor) {
        if (err) throw err;
        res.json(fornecedor);
    });
})

.put(function (req, res, next) {
    Fornecedor.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function (err, fornecedor) {
        if (err) throw err;
        res.json(fornecedor);
    });
})

.delete(function (req, res, next) {
    Fornecedor.findByIdAndRemove(req.params.id, function (err, resp) {        if (err) throw err;
        res.json(resp);
    });
});

module.exports = fornecedorRouter;