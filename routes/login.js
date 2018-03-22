var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');
var uuid = require('uuid');


router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function (err) {
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
  })(req, res, next);
});

//Password Recovery
router.post('/esqueci-senha', function (req, res, next) {
  var state = uuid();
  User.update({ username: req.body.login, email: req.body.email },
      {
        $set: {
          state: state
        }
      },
      function (err, data) {
        //send email
        res.json(data);
      }
    );
});

router.post('/nova-senha', function (req, res, next) {
  User.findOne({ state: req.body.state },
    function (err, user) {
      user.setPassword(req.body.senha, function(error){
        user.state = "";
        user.save();
      });
      res.json(user);
    }
  );
});

module.exports = router;