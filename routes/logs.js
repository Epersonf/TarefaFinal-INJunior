var express = require('express');
var router = express.Router();
var passport = require('passport');
var Pecalog = require('../models/pecalog');

router.post('/' ,function (req, res, next) {
    Pecalog.create(req.body, function (err) {
        if (err) throw err;
        res.json("Pecalog realizado!");
    });
});
router.get('/' ,function (req, res, next) {
    Pecalog.find({}).populate({
        path: 'user',
        select: 'nome _id'
    }).exec( function (err, log) {
        if (err) throw err;
        res.json(log);
    });
});

router.get('/acao/:acao' ,function (req, res, next) {
    Pecalog.find({acao:req.params.acao}).populate({
        path: 'user',
        select: 'nome _id'
    }).exec(function (err, log) {
        if (err) throw err;
        res.json(log);
    });
});

router.get('/usuario/:id' ,function (req, res, next) {
    Pecalog.find({user:req.params.id}, function (err, log) {
        if (err) throw err;
        res.json(log);
    });
});

router.delete('/:id', function (req, res, next) {
     Pecalog.remove({_id:req.params.id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

router.post('/atualizar' ,function (req, res, next) {
    Pecalog.update({"_id" : req.body._id},{$set : req.body.update}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});
router.post('/total' ,function (req, res, next) {
    Pecalog.find({"acao" : req.body.acao}).count(function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});


module.exports = router;