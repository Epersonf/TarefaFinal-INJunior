var express = require('express');
var router = express.Router();
var passport = require('passport');
var Log = require('../models/log');

router.post('/' ,function (req, res, next) {
    Log.create(req.body, function (err) {
        if (err) throw err;
        res.json("Log realizado!");
    });
});
router.get('/' ,function (req, res, next) {
    Log.find({}, function (err, log) {
        if (err) throw err;
        res.json(log);
    });
});

router.get('/usuario/:id' ,function (req, res, next) {
    Log.find({userId:req.params.id}, function (err, log) {
        if (err) throw err;
        res.json(log);
    });
});

router.delete('/:id', function (req, res, next) {
     Log.remove({_id:req.params.id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

router.post('/atualizar' ,function (req, res, next) {
    Log.update({"_id" : req.body._id},{$set : req.body.update}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});
router.post('/total' ,function (req, res, next) {
    Log.find({"status" : req.body.status}).count(function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});


module.exports = router;