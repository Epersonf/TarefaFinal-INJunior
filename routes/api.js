var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.post('/cadastro', function(req, res) {
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

module.exports = router;