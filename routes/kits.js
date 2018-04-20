var express = require('express');
var router = express.Router();
var Kit = require('../models/kit');

router.post('/' ,function (req, res, next) {
    Kit.create(req.body, function (err) {
        if (err) throw err;
        res.json("Kit criado com sucesso!");
    });
});
router.get('/' ,function (req, res, next) {
    Kit.find({}).populate({
        path: 'consultora',
        select: 'nome _id',
        })
        .populate({
        path: 'supervisor',
        select: 'nome _id',
        })
        .exec(function (err, kit) {
        if (err) throw err;
        res.json(kit);
    });
});

router.get('/porConsultora/:id' ,function (req, res, next) {
    Kit.find({consultora: req.params.id}).exec(function (err, kit) {
            if (err) throw err;
            res.json(kit);
    });
});

router.post('/atualizar' ,function (req, res, next) {
    Kit.update({"_id" : req.body._id},{$set : req.body.update}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

module.exports = router;