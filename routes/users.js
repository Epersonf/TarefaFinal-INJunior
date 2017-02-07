<<<<<<< HEAD
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify    = require('./verify');

var Supervisor = require('../models/supervisores');
var Consultor = require('../models/consultores');

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
        
        if (user.tipo==="Consultor"){
            req.body.extra._id = user._id;
            req.body.extra.nome = user.nome;
            Consultor.create(req.body.extra, function(err){
                if (err) {
                    return res.status(500).json({err: "Falha ao criar Consultor"});;
                }
            });
        } else if (user.tipo==="Supervisor"){
            req.body.extra._id = user._id;
            req.body.extra.nome = user.nome;
            Supervisor.create(req.body.extra, function(err){
                if (err) {
                    return res.status(500).json({err: "Falha ao criar Supervisor"});;
                }
            });
        }else console.log("Criacao completa!");

        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({status: 'Usuário registrado', id: user._id});
        });
    });
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Falha ao entrar.'
        });
      }
        
      var token = Verify.getToken(user);
              res.status(200).json({
        status: 'Logado com sucesso',
        success: true,
        token: token,
		user: user
      });
    });
  })(req,res,next);
});

router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Até mais!'
  });
});

router.delete('/', function (req, res, next) {
     User.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
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

module.exports = router;