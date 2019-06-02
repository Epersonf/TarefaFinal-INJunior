var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');
var uuid = require('uuid');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'mx1.weblink.com.br',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: 'equipe@ambaya.com.br',
    pass: 'ambaya2014'
  }
})


router.post('/', 
  passport.authenticate('local'),
  function (req, res) {
    var token = Verify.getToken(req.user);
    res.status(200).json({
      status: 'Logado com sucesso',
      success: true,
      token: token,
      user: req.user
    });
  }
);

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
      var mailOptions = {
        from: '"Equipe Ambaya" <equipe@ambaya.com.br>',
        to: req.body.email,
        subject: 'Recuperação de Senha',
        html: '<p>Para recuperar sua senha <a href="http://minha.ambaya.com.br/#/recuperar-senha/' + state + '">clique aqui</a></p>' // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        res.json(data);
      });
    }
  );
});

router.post('/nova-senha', function (req, res, next) {
  User.findOne({ state: req.body.state },
    function (err, user) {
      user.setPassword(req.body.senha, function (error) {
        user.state = "";
        user.save();
      });
      res.json(user);
    }
  );
});

module.exports = router;