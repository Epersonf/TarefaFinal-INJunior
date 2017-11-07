var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify    = require('./verify');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});

router.post('/register', function(req, res) {
    User.register(new User(req.body),
      req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        //console.log(user);
        //criacaoo de configuracoes de consultor e supervisor

        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({status: 'Usuário registrado', id: user._id});
        });
    });
});

router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Até mais!'
  });
});

/*router.delete('/', function (req, res, next) {
     User.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});*/


//supervisores
router.get('/supervisores', function(req, res, next) {
  User.find({tipo:"Supervisor"}, function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});
router.get('/supervisores/num', function(req, res, next) {
  User.find({tipo:"Supervisor"}).count (function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});

//consultores
router.get('/consultores', function(req, res, next) {
  User.find({tipo:"Consultor"}).populate({
    path: 'supervisor',
    select: 'nome _id'
}).exec(function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});
router.get('/consultores/num', function(req, res, next) {
  User.find({tipo:"Consultor"}).count(function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});
router.get('/consultores/:id', function(req, res, next) { //por supervisor
  User.find({tipo:"Consultor", supervisor:req.params.id}).populate({
      path: 'supervisor',
      select: 'nome _id'
  }).exec(function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});

//todos

router.get('/estoqueId/', function(req, res, next) { //por supervisor
  User.findOne({tipo:"Estoque"}, function (err, user) {
        if (err) throw err;
        res.json(user._id);
    });
});

router.post('/atualizar' ,function (req, res, next) {
    User.update({"_id" : req.body._id},{$set : req.body.update}, function (err, consultor) {
                    if (err) throw err;
                    res.json(consultor);
                });
});

router.post('/entrada' ,function (req, res, next) {
    User.update({"_id" : req.body._id},{$push: {estoque: {$each: req.body.entrada} } }, function (err, consultor) {
        if (err) throw err;
        res.json("Peças adicionadas!");
    });
});

router.delete('/:id', function (req, res, next) {
     User.remove({_id:req.params.id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});
router.get('/:id', function(req, res, next) {
    User.findOne({_id:req.params.id}, function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});

//pecas
router.get('/estoque/:id', function(req, res, next) {
  User.findOne({_id:req.params.id}, function (err, user) {
        if (err) throw err;
        res.json(user.estoque);
    });
});
router.post('/estoque/:id' ,function (req, res, next) {
    User.update({_id:req.params.id},{$push: {estoque: {$each: req.body.estoque} } }, function (err, consultor) {
        if (err) throw err;
        res.json("Peças adicionadas!");
    });
});
router.get('/vendido/:id', function(req, res, next) {
  User.findOne({_id:req.params.id}, function (err, user) {
        if (err) throw err;
        res.json(user.vendido);
    });
});
router.post('/vendido/:id' ,function (req, res, next) {
    User.update({_id:req.params.id},{$push: {estoque: {$each: req.body.vendido} } }, function (err, consultor) {
        if (err) throw err;
        res.json("Peças adicionadas!");
    });
});

module.exports = router;