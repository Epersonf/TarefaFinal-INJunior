var express = require('express');
var router = express.Router();
var passport = require('passport');
var Acerto = require('../models/acerto');

router.post('/' ,function (req, res, next) {
    Acerto.create(req.body, function (err) {
        if (err) throw err;
        res.json("Acerto realizado!");
    });
});
router.get('/' ,function (req, res, next) {
    Acerto.find({}, function (err, acerto) {
        if (err) throw err;
        res.json(acerto);
    });
});

router.get('/usuario/:id' ,function (req, res, next) {
    Acerto.find({userId:req.params.id}, function (err, acerto) {
        if (err) throw err;
        res.json(acerto);
    });
});

router.delete('/:id', function (req, res, next) {
     Acerto.remove({_id:req.params.id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

router.post('/atualizar' ,function (req, res, next) {
    Acerto.update({"_id" : req.body._id},{$set : req.body.update}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});
router.post('/total' ,function (req, res, next) {
    Acerto.find({"status" : req.body.status}).count(function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});


module.exports = router;