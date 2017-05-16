var express = require('express');
var router = express.Router();
var passport = require('passport');
var Equipamento = require('../models/equipamento');

router.post('/' ,function (req, res, next) {
    Equipamento.create(req.body, function (err) {
        if (err) throw err;
        res.json("Equipamento criado!");
    });
});
router.get('/' ,function (req, res, next) {
    Equipamento.find({}, function (err, Equipamento) {
        if (err) throw err;
        res.json(Equipamento);
    });
});

router.get('/:id' ,function (req, res, next) {
    Equipamento.find({donoId:req.params.id}, function (err, Equipamento) {
        if (err) throw err;
        res.json(Equipamento);
    });
});

router.get('/nome/:nome' ,function (req, res, next) {
    Equipamento.find({nome:req.params.nome}, function (err, Equipamento) {
        if (err) throw err;
        res.json(Equipamento);
    });
});
router.get('/local/:local' ,function (req, res, next) {
    Equipamento.find({local:req.params.local}, function (err, Equipamento) {
        if (err) throw err;
        res.json(Equipamento);
    });
});
router.post('/atualizar' ,function (req, res, next) {
    Equipamento.update({"_id" : req.body._id},{$set : req.body.update}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});



module.exports = router;