var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify    = require('./verify');


router.post('/', function(req, res, next) {
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

module.exports = router;