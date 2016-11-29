var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Kit = require('../models/kits');

var kitRouter = express.Router();
kitRouter.use(bodyParser.json());

kitRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Kit.find({}, function (err, kit) {
        if (err) throw err;
        res.json(kit);
    });
})

.post(function (req, res, next) {
    Kit.create(req.body, function (err, kit) {
        if (err) throw err;
        console.log('kit criado');
        var id = kit._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('kit adicionado com o id: ' + id);
    });
})

.delete(function (req, res, next) {
    Kit.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

kitRouter.route('/:id')
.get(function (req, res, next) {
    Kit.findById(req.params.id, function (err, kit) {
        if (err) throw err;
        res.json(kit);
    });
})

.put(function (req, res, next) {
    Kit.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function (err, kit) {
        if (err) throw err;
        res.json(kit);
    });
})

.delete(function (req, res, next) {
    Kit.findByIdAndRemove(req.params.id, function (err, resp) {        if (err) throw err;
        res.json(resp);
    });
});

kitRouter.route('/:id/pecas')
.get(function (req, res, next) {
    Kit.findById(req.params.id, function (err, kit) {
        if (err) throw err;
        res.json(kit.pecas);
    });
})

.post(function (req, res, next) {
	Kit.findById(req.params.id, function (err, kit) {
        if (err) throw err;
        kit.pecas.push(req.body);
		kit.save(function (err, kit) {
            if (err) throw err;
            console.log('Peça adicionada!');
            res.json(kit);
        });
    });
})

.delete(function (req, res, next) {
    Kit.findById(req.params.id, function (err, kit) {
        if (err) throw err;
		for (var i = (kit.pecas.comments.length - 1); i >= 0; i--) {
            kit.pecas.id(kit.pecas[i]._id).remove();
        }
		kit.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Todas as peças personalizadas foram deletadas!');
        });
    });
});

kitRouter.route('/proprietario/:id')
.get(function (req, res, next) {
    Kit.find({"proprietario": req.params.id}, function (err, kit) {
        if (err) throw err;
        res.json(kit);
    });
});

// .delete(function (req, res, next) {
    // Kit.findByIdAndRemove(req.params.id, function (err, resp) {        if (err) throw err;
        // res.json(resp);
    // });
// });

module.exports = kitRouter;