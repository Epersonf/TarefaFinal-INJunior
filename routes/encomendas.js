var express = require('express');
var router = express.Router();
var passport = require('passport');
var Encomenda = require('../models/encomenda');

router.post('/' ,function (req, res, next) {
    Encomenda.create(req.body, function (err) {
        if (err) throw err;
        res.json("Encomenda realizada!");
    });
});
router.get('/' ,function (req, res, next) {
    Encomenda.find({}.limit(20), function (err, encomenda) {
        if (err) throw err;
        res.json(encomenda);
    });
});

router.get('/supervisor/:id' ,function (req, res, next) {
    Encomenda.find({donoId:req.params.id}, function (err, encomenda) {
        if (err) throw err;
        res.json(encomenda);
    });
});

router.get('/consultor/:id' ,function (req, res, next) {
    Encomenda.find({consultorId:req.params.id}, function (err, encomenda) {
        if (err) throw err;
        res.json(encomenda);
    });
});

router.delete('/:id', function (req, res, next) {
     Encomenda.remove({_id:req.params.id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

router.post('/atualizar' ,function (req, res, next) {
    Encomenda.update({"_id" : req.body._id},{$set : req.body.update}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});
router.post('/total' ,function (req, res, next) {
    Encomenda.find({"status" : req.body.status}).count(function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});


module.exports = router;