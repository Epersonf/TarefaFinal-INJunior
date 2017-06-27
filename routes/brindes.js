var express = require('express');
var router = express.Router();
var passport = require('passport');
var Brinde = require('../models/brinde');

router.post('/' ,function (req, res, next) {
    Brinde.create(req.body, function (err) {
        if (err) throw err;
        res.json("Brinde realizado!");
    });
});
router.get('/' ,function (req, res, next) {
    Brinde.find({}, function (err, brinde) {
        if (err) throw err;
        res.json(brinde);
    });
});

router.get('/usuario/:id' ,function (req, res, next) {
    Brinde.find({userId:req.params.id}, function (err, brinde) {
        if (err) throw err;
        res.json(brinde);
    });
});

router.delete('/:id', function (req, res, next) {
     Brinde.remove({_id:req.params.id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

router.post('/atualizar' ,function (req, res, next) {
    Brinde.update({"_id" : req.body._id},{$set : req.body.update}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});
router.post('/total' ,function (req, res, next) {
    Brinde.find({"status" : req.body.status}).count(function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});


module.exports = router;