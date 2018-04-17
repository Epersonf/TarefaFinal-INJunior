var express = require('express');
var router = express.Router();
var passport = require('passport');
var Troca = require('../models/troca');
var User = require('../models/user');

router.post('/' ,function (req, res, next) {
    Troca.create(req.body, function (err) {
        if(req.body.saldo){
            User.findOne({_id:req.body.consultorId}, function (err, user) {
                user.totalVendido = user.totalVendido+req.body.saldo;
                user.save();
            });
        }
        if (err) throw err;
        res.json("Troca realizado!");
    });
});
router.get('/' ,function (req, res, next) {
    Troca.find({}, function (err, troca) {
        if (err) throw err;
        res.json(troca);
    });
});

router.get('/usuario/:id' ,function (req, res, next) {
    Troca.find({userId:req.params.id}, function (err, troca) {
        if (err) throw err;
        res.json(troca);
    });
});

router.delete('/:id', function (req, res, next) {
     Troca.remove({_id:req.params.id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

router.post('/atualizar' ,function (req, res, next) {
    Troca.update({"_id" : req.body._id},{$set : req.body.update}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});
router.post('/total' ,function (req, res, next) {
    Troca.find({"status" : req.body.status}).count(function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});


module.exports = router;