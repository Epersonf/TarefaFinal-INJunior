<<<<<<< HEAD
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Consultor = require('../models/consultores');
var User = require('../models/user');

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
consultorRouter.route('/totais/:id')
    .get(function (req, res, next) {
        Consultor.aggregate([{$match:{status: 'Pendente'}},{$group: {_id: null, totalVendido:{$sum: '$vendido'}}}], function (err, consultor) {
            if (err) throw err;
            res.json(consultor);
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
consultorRouter.route('/atualizar/')
    .post(function (req, res, next) {
        Consultor.update({"_id" : req.body._id},{$set : req.body.update}, function (err, consultor) {
                    if (err) throw err;
                    res.json(consultor);
                });
    })
;
  

=======
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Consultor = require('../models/consultores');
var User = require('../models/user');

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
consultorRouter.route('/totais/:id')
    .get(function (req, res, next) {
        Consultor.aggregate([{$match:{status: 'Pendente'}},{$group: {_id: null, totalVendido:{$sum: '$vendido'}}}], function (err, consultor) {
            if (err) throw err;
            res.json(consultor);
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
consultorRouter.route('/atualizar/')
    .post(function (req, res, next) {
        Consultor.update({"_id" : req.body._id},{$set : req.body.update}, function (err, consultor) {
                    if (err) throw err;
                    res.json(consultor);
                });
    })
;
  

>>>>>>> 2c53561b564454f6f4c20e634b0463a72203b687
module.exports = consultorRouter;