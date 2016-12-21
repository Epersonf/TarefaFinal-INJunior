var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Consultor = require('../models/consultores');

var consultorRouter = express.Router();
consultorRouter.use(bodyParser.json());

consultorRouter.route('/')
    .get(function (req, res, next) {
        Consultor.find({}, function (err, consultor) {
            if (err) throw err;
            // consultor.forEach(function(sup){
            //     User.findOne({_id: sup._id}, {nome:1}, function (err, user) {
            //         console.log(user.nome);
            //         sup.status = user.nome;
            //         return sup;
            //     });
            // });
            res.json(consultor);
        });
    })

    .post(function (req, res, next) {
        Consultor.create(req.body, function (err, consultor) {
            if (err) throw err;
            console.log('consultor criado');
            var id = consultor._id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Consultor adicionado');
        });
    })

    .delete(function (req, res, next) {
        Consultor.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    })
;

consultorRouter.route('/quantidade')
    .get(function (req, res, next) {
        var num = Consultor.find({}).count(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    })
;

consultorRouter.route('/:id')
    .get(function (req, res, next) {
        Consultor.findById(req.params.id, function (err, consultor) {
            if (err) throw err;
            res.json(consultor);
        });
    })

    .put(function (req, res, next) {
        Consultor.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        }, function (err, consultor) {
            if (err) throw err;
            res.json(consultor);
        });
    })

    .delete(function (req, res, next) {
        Consultor.findByIdAndRemove(req.params.id, function (err, resp) {        
        if (err) throw err;
            res.json(resp);
        });
    })
;

consultorRouter.route('/supervisor/:id')
    .get(function (req, res, next) {
        Consultor.find({'supervisor': req.params.id}, function (err, consultor) {
            if (err) throw err;
            res.json(consultor);
        });
    })
;   

module.exports = consultorRouter;